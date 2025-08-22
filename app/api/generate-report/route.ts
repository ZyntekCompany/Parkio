import * as XLSX from "xlsx";
import { DateTime } from "luxon";
import { NextResponse, type NextRequest } from "next/server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth-user";
import { formatDate } from "@/utils/format-date";

// Función para crear estilos de celda
function createCellStyle(
  font: { bold?: boolean; color?: string; size?: number } = {},
  fill: { fgColor?: string; patternType?: string } = {},
  alignment: { horizontal?: string; vertical?: string } = {},
  border: { style?: string; color?: string } = {}
) {
  return {
    font: {
      name: "Arial",
      size: font.size || 11,
      bold: font.bold || false,
      color: font.color || { rgb: "000000" },
    },
    fill: {
      fgColor: fill.fgColor || { rgb: "FFFFFF" },
      patternType: fill.patternType || "solid",
    },
    alignment: {
      horizontal: alignment.horizontal || "left",
      vertical: alignment.vertical || "center",
      wrapText: true,
    },
    border: {
      top: { style: border.style || "thin", color: border.color || { rgb: "000000" } },
      bottom: { style: border.style || "thin", color: border.color || { rgb: "000000" } },
      left: { style: border.style || "thin", color: border.color || { rgb: "000000" } },
      right: { style: border.style || "thin", color: border.color || { rgb: "000000" } },
    },
  };
}

// Función para obtener colores según el tipo de reporte
function getReportColors(reportType: string) {
  switch (reportType) {
    case "Ganancias":
      return {
        header: "2E8B57", // Verde mar
        accent: "90EE90", // Verde claro
        border: "228B22"  // Verde bosque
      };
    case "Clientes Mensuales":
      return {
        header: "4169E1", // Azul real
        accent: "87CEEB", // Cielo azul
        border: "0000CD"  // Azul medio
      };
    case "Clientes por Hora":
      return {
        header: "FF6347", // Tomate
        accent: "FFB6C1", // Rosa claro
        border: "DC143C"  // Carmesí
      };
    case "Clientes Mensuales Próximos a Expirar":
      return {
        header: "FF8C00", // Naranja oscuro
        accent: "FFD700", // Dorado
        border: "FF4500"  // Naranja rojizo
      };
    default:
      return {
        header: "4472C4", // Azul corporativo
        accent: "B8CCE4", // Azul claro
        border: "2F5496"  // Azul oscuro
      };
  }
}

// Función para aplicar estilos al worksheet
function applyWorksheetStyles(worksheet: XLSX.WorkSheet, data: any[], reportType: string) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const range = XLSX.utils.decode_range(worksheet["!ref"]!);
  const colors = getReportColors(reportType);
  
  // Estilo para encabezados
  const headerStyle = createCellStyle(
    { bold: true, size: 12, color: "FFFFFF" },
    { fgColor: colors.header, patternType: "solid" },
    { horizontal: "center", vertical: "center" },
    { style: "medium", color: colors.border }
  );

  // Estilo para datos
  const dataStyle = createCellStyle(
    { size: 10 },
    { fgColor: "F8F9FA" },
    { horizontal: "left", vertical: "center" },
    { style: "thin", color: colors.border }
  );

  // Estilo para filas alternas
  const alternateDataStyle = createCellStyle(
    { size: 10 },
    { fgColor: colors.accent + "20" }, // Color con transparencia
    { horizontal: "left", vertical: "center" },
    { style: "thin", color: colors.border }
  );

  // Aplicar estilos a encabezados
  headers.forEach((header, colIndex) => {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex });
    if (!worksheet[cellAddress]) {
      worksheet[cellAddress] = { v: header };
    }
    worksheet[cellAddress].s = headerStyle;
  });

  // Aplicar estilos a datos con formato especial
  for (let rowIndex = 1; rowIndex <= range.e.r; rowIndex++) {
    const isAlternateRow = rowIndex % 2 === 0;
    const currentStyle = isAlternateRow ? alternateDataStyle : dataStyle;
    
    headers.forEach((header, colIndex) => {
      const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
      if (worksheet[cellAddress]) {
        // Aplicar estilo base
        worksheet[cellAddress].s = { ...currentStyle };
        
        // Formato especial para columnas numéricas
        if (header.includes("Total") || header.includes("Precio") || header.includes("Pago")) {
          worksheet[cellAddress].s.numFmt = '"$"#,##0.00';
          worksheet[cellAddress].s.font.bold = true;
          worksheet[cellAddress].s.font.color = { rgb: "28A745" }; // Verde para montos
          worksheet[cellAddress].s.alignment.horizontal = "right";
        }
        
        // Formato especial para fechas
        if (header.includes("Fecha") || header.includes("Hora") || header.includes("Entrada") || header.includes("Salida")) {
          worksheet[cellAddress].s.numFmt = 'dd/mm/yyyy hh:mm';
          worksheet[cellAddress].s.font.color = { rgb: "6C757D" }; // Gris para fechas
          worksheet[cellAddress].s.alignment.horizontal = "center";
        }
        
        // Formato especial para columnas de estado
        if (header.includes("Activo")) {
          if (worksheet[cellAddress].v === 'Si') {
            worksheet[cellAddress].s.font.color = { rgb: "28A745" }; // Verde para activo
            worksheet[cellAddress].s.font.bold = true;
          } else {
            worksheet[cellAddress].s.font.color = { rgb: "DC3545" }; // Rojo para inactivo
            worksheet[cellAddress].s.font.bold = true;
          }
          worksheet[cellAddress].s.alignment.horizontal = "center";
        }
        
        // Formato especial para días restantes
        if (header.includes("Dias") || header.includes("Restantes")) {
          const days = Number(worksheet[cellAddress].v);
          if (days <= 2) {
            worksheet[cellAddress].s.font.color = { rgb: "DC3545" }; // Rojo para días críticos
            worksheet[cellAddress].s.font.bold = true;
            worksheet[cellAddress].s.fill.fgColor = { rgb: "FFE6E6" }; // Fondo rojo claro
          } else if (days <= 5) {
            worksheet[cellAddress].s.font.color = { rgb: "FFC107" }; // Amarillo para días de advertencia
            worksheet[cellAddress].s.font.bold = true;
            worksheet[cellAddress].s.fill.fgColor = { rgb: "FFF8E1" }; // Fondo amarillo claro
          }
          worksheet[cellAddress].s.alignment.horizontal = "center";
        }
      }
    });
  }

  // Ajustar ancho de columnas automáticamente
  headers.forEach((header, colIndex) => {
    const maxLength = Math.max(
      header.length,
      ...data.map(row => String(row[header] || "").length)
    );
    const columnWidth = Math.min(Math.max(maxLength + 2, 12), 50);
    
    if (!worksheet["!cols"]) worksheet["!cols"] = [];
    worksheet["!cols"][colIndex] = { width: columnWidth };
  });

  // Agregar filtros a los encabezados
  worksheet["!autofilter"] = { ref: `A1:${XLSX.utils.encode_col(headers.length - 1)}1` };
  
  // Ajustar altura de filas
  if (!worksheet["!rows"]) worksheet["!rows"] = [];
  worksheet["!rows"][0] = { hpt: 30 }; // Encabezados más altos
  for (let i = 1; i <= range.e.r; i++) {
    worksheet["!rows"][i] = { hpt: 22 }; // Filas de datos
  }
}

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

    // Crear workbook y worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Aplicar estilos profesionales
    applyWorksheetStyles(worksheet, data, reportType);
    
    // Agregar el worksheet al workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");
    
    // Generar el archivo Excel
    const buf = XLSX.write(workbook, { 
      type: "buffer", 
      bookType: "xlsx",
      compression: true
    });

    return new Response(buf, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${reportType}_${DateTime.now().toFormat('yyyy-MM-dd_HH-mm')}.xlsx"`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("Error generando reporte:", error);
    return NextResponse.json(
      { message: "Error generando el reporte." },
      { status: 500 }
    );
  }
}
