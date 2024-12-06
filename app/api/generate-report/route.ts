import * as XLSX from "xlsx";
import { DateTime } from "luxon";
import { NextResponse, type NextRequest } from "next/server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth-user";
import { formatDate } from "@/utils/format-date";

export async function POST(req: NextRequest) {
  try {
    const { reportType, startDate, endDate, generateWithoutDateRange } =
      await req.json();
    const loggedUser = await currentUser();

    if (generateWithoutDateRange && !reportType) {
      return NextResponse.json(
        { message: "Falta el tipo de reporte." },
        { status: 400 }
      );
    } else if (
      !generateWithoutDateRange &&
      reportType !== "Clientes Mensuales Próximos a Expirar" &&
      (!reportType || !startDate || !endDate)
    ) {
      return NextResponse.json(
        { message: "Faltan parámetros obligatorios." },
        { status: 400 }
      );
    }

    if (!loggedUser || !loggedUser.parkingLotId) {
      return NextResponse.json(
        { message: "Usuario no autenticado o sin acceso a parqueadero." },
        { status: 400 }
      );
    }

    let start: Date;
    let end: Date;

    if (!generateWithoutDateRange) {
      start = DateTime.fromISO(startDate, {
        zone: "America/Bogota",
      }).toJSDate();
      end = DateTime.fromISO(endDate, {
        zone: "America/Bogota",
      }).toJSDate();

      // Validar rango de fechas
      if (start > end) {
        return NextResponse.json(
          { message: "Rango de fechas inválido." },
          { status: 400 }
        );
      }
    }

    let data = [];

    // Consultar datos según el tipo de reporte
    if (!generateWithoutDateRange && start! && end!) {
      switch (reportType) {
        case "Ganancias": {
          const now = DateTime.now().setZone("America/Bogota");
          const startOfYear = now.startOf("year");
          const endOfYear = now.endOf("year");

          const clients = await db.client.findMany({
            where: {
              parkingLotId: loggedUser.parkingLotId,
              createdAt: {
                gte: startOfYear.toJSDate(),
                lte: endOfYear.toJSDate(),
              },
            },
            select: {
              clientCategory: true,
              clientType: {
                select: {
                  name: true,
                },
              },
              vehicleType: {
                select: {
                  name: true,
                },
              },
              plate: true,
              totalPaid: true,
            },
            orderBy: {
              startDate: "desc",
            },
          });

          data = clients.map((client) => ({
            "Categoria de Cliente":
              client.clientCategory === "HOURLY" ? "Por hora" : "Mensual",
            "Tipo de Cliente": client.clientType.name,
            "Tipo de Vehículo": client.vehicleType.name,
            "Total Pagado": client.totalPaid,
          }));
          break;
        }

        case "Clientes Mensuales": {
          const clients = await db.client.findMany({
            where: {
              parkingLotId: loggedUser.parkingLotId,
              clientCategory: "MONTHLY",
              createdAt: { gte: start, lte: end },
            },
            select: {
              name: true,
              document: true,
              clientType: {
                select: {
                  name: true,
                },
              },
              vehicleType: {
                select: {
                  name: true,
                },
              },
              plate: true,
              isActive: true,
              totalPaid: true,
              startDate: true,
              endDate: true,
              phone: true,
              email: true,
              clientCategory: true,
            },
            orderBy: {
              startDate: "desc",
            },
          });

          data = clients.map((client) => ({
            Nombre: client.name,
            "N° Documento": client.document,
            Teléfono: client.phone,
            Correo: client.email,
            "Tipo de Cliente": client.clientType.name,
            "Tipo de Vehículo": client.vehicleType.name,
            Placa: client.plate,
            Activo: client.isActive ? "Si" : "No",
            "Fecha de Inicio": formatDate(client.startDate!),
            "Fecha de Finalización": formatDate(client.endDate!),
            "Total Pagado": client.totalPaid,
          }));
          break;
        }

        case "Clientes por Hora": {
          const clients = await db.client.findMany({
            where: {
              parkingLotId: loggedUser.parkingLotId,
              clientCategory: "HOURLY",
              exitDate: { not: null },
              createdAt: { gte: start, lte: end },
            },
            select: {
              clientType: {
                select: {
                  name: true,
                },
              },
              vehicleType: {
                select: {
                  name: true,
                },
              },
              plate: true,
              totalPaid: true,
              entryDate: true,
              exitDate: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          });

          data = clients.map((client) => ({
            "Tipo de Cliente": client.clientType.name,
            "Tipo de Vehículo": client.vehicleType.name,
            Placa: client.plate,
            "Hora de Entrada": formatDate(client.entryDate!, true),
            "Hora de Salida": formatDate(client.exitDate!, true),
            "Total Pagado": client.totalPaid,
          }));
          break;
        }

        case "Clientes Mensuales Próximos a Expirar": {
          const zone = "America/Bogota";
          const now = DateTime.now().setZone(zone);
          const fiveDaysFromNow = now.plus({ days: 5 });

          const clients = await db.client.findMany({
            where: {
              parkingLotId: loggedUser.parkingLotId,
              clientCategory: "MONTHLY",
              isActive: true,
              endDate: {
                gte: now.toJSDate(),
                lte: fiveDaysFromNow.toJSDate(),
              },
            },
            select: {
              name: true,
              document: true,
              clientType: {
                select: {
                  name: true,
                },
              },
              vehicleType: {
                select: {
                  name: true,
                },
              },
              plate: true,
              isActive: true,
              totalPaid: true,
              startDate: true,
              endDate: true,
              phone: true,
              email: true,
              clientCategory: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          });

          if (clients.length === 0) {
            return NextResponse.json(
              { message: "No hay clientes con servicio próximo a expirar." },
              { status: 400 }
            );
          }

          data = clients.map((client) => {
            const endDate = DateTime.fromJSDate(
              new Date(client.endDate!)
            ).setZone("America/Bogota");
            const today = DateTime.now().setZone("America/Bogota");

            return {
              Nombre: client.name,
              "N° Documento": client.document,
              Teléfono: client.phone,
              Correo: client.email,
              "Tipo de Cliente": client.clientType.name,
              "Tipo de Vehículo": client.vehicleType.name,
              Placa: client.plate,
              Activo: client.isActive ? "Si" : "No",
              "Total Pagado": client.totalPaid,
              "Fecha de Inicio": formatDate(client.startDate!),
              "Fecha de Finalización": formatDate(client.endDate!),
              "Dias Restantes de Servicio": Math.ceil(
                endDate.diff(today, "days").days
              ),
            };
          });
          break;
        }

        default:
          return NextResponse.json(
            { message: "Tipo de reporte no válido." },
            { status: 400 }
          );
      }
    } else {
      switch (reportType) {
        case "Ganancias": {
          const now = DateTime.now().setZone("America/Bogota");
          const startOfYear = now.startOf("year");
          const endOfYear = now.endOf("year");

          const clients = await db.client.findMany({
            where: {
              parkingLotId: loggedUser.parkingLotId,
              createdAt: {
                gte: startOfYear.toJSDate(),
                lte: endOfYear.toJSDate(),
              },
            },
            select: {
              clientCategory: true,
              clientType: {
                select: {
                  name: true,
                },
              },
              vehicleType: {
                select: {
                  name: true,
                },
              },
              plate: true,
              totalPaid: true,
            },
            orderBy: {
              startDate: "desc",
            },
          });

          data = clients.map((client) => ({
            "Categoria de Cliente":
              client.clientCategory === "HOURLY" ? "Por hora" : "Mensual",
            "Tipo de Cliente": client.clientType.name,
            "Tipo de Vehículo": client.vehicleType.name,
            "Total Pagado": client.totalPaid,
          }));
          break;
        }

        case "Clientes Mensuales": {
          const clients = await db.client.findMany({
            where: {
              parkingLotId: loggedUser.parkingLotId,
              clientCategory: "MONTHLY",
            },
            select: {
              name: true,
              document: true,
              clientType: {
                select: {
                  name: true,
                },
              },
              vehicleType: {
                select: {
                  name: true,
                },
              },
              plate: true,
              isActive: true,
              totalPaid: true,
              startDate: true,
              endDate: true,
              phone: true,
              email: true,
              clientCategory: true,
            },
            orderBy: {
              startDate: "desc",
            },
          });

          data = clients.map((client) => ({
            Nombre: client.name,
            "N° Documento": client.document,
            Teléfono: client.phone,
            Correo: client.email,
            "Tipo de Cliente": client.clientType.name,
            "Tipo de Vehículo": client.vehicleType.name,
            Placa: client.plate,
            Activo: client.isActive ? "Si" : "No",
            "Fecha de Inicio": formatDate(client.startDate!),
            "Fecha de Finalización": formatDate(client.endDate!),
            "Total Pagado": client.totalPaid,
          }));
          break;
        }

        case "Clientes por Hora": {
          const clients = await db.client.findMany({
            where: {
              parkingLotId: loggedUser.parkingLotId,
              clientCategory: "HOURLY",
              exitDate: { not: null },
            },
            select: {
              clientType: {
                select: {
                  name: true,
                },
              },
              vehicleType: {
                select: {
                  name: true,
                },
              },
              plate: true,
              totalPaid: true,
              entryDate: true,
              exitDate: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          });

          data = clients.map((client) => ({
            "Tipo de Cliente": client.clientType.name,
            "Tipo de Vehículo": client.vehicleType.name,
            Placa: client.plate,
            "Fecha/Hora de Entrada": formatDate(client.entryDate!, true),
            "Fecha/Hora de Salida": formatDate(client.exitDate!, true),
            "Total Pagado": client.totalPaid,
          }));
          break;
        }

        case "Clientes Mensuales Próximos a Expirar": {
          const zone = "America/Bogota";
          const now = DateTime.now().setZone(zone);
          const fiveDaysFromNow = now.plus({ days: 5 });

          const clients = await db.client.findMany({
            where: {
              parkingLotId: loggedUser.parkingLotId,
              clientCategory: "MONTHLY",
              isActive: true,
              endDate: {
                gte: now.toJSDate(),
                lte: fiveDaysFromNow.toJSDate(),
              },
            },
            select: {
              name: true,
              document: true,
              clientType: {
                select: {
                  name: true,
                },
              },
              vehicleType: {
                select: {
                  name: true,
                },
              },
              plate: true,
              isActive: true,
              totalPaid: true,
              startDate: true,
              endDate: true,
              phone: true,
              email: true,
              clientCategory: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          });

          if (clients.length === 0) {
            return NextResponse.json(
              { message: "No hay clientes con servicio próximo a expirar." },
              { status: 400 }
            );
          }

          data = clients.map((client) => {
            const endDate = DateTime.fromJSDate(
              new Date(client.endDate!)
            ).setZone("America/Bogota");
            const today = DateTime.now().setZone("America/Bogota");

            return {
              Nombre: client.name,
              "N° Documento": client.document,
              Teléfono: client.phone,
              Correo: client.email,
              "Tipo de Cliente": client.clientType.name,
              "Tipo de Vehículo": client.vehicleType.name,
              Placa: client.plate,
              Activo: client.isActive ? "Si" : "No",
              "Total Pagado": client.totalPaid,
              "Fecha de Inicio": formatDate(client.startDate!),
              "Fecha de Finalización": formatDate(client.endDate!),
              "Dias Restantes de Servicio": Math.ceil(
                endDate.diff(today, "days").days
              ),
            };
          });
          break;
        }

        default:
          return NextResponse.json(
            { message: "Tipo de reporte no válido." },
            { status: 400 }
          );
      }
    }

    if (data.length === 0) {
      return NextResponse.json(
        { message: "No hay datos para el rango de fechas seleccionado." },
        { status: 400 }
      );
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");
    const buf = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new Response(buf, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${reportType}.xlsx"`,
        "Content-Type": "application/vnd.ms-excel",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error generando el reporte." },
      { status: 500 }
    );
  }
}
