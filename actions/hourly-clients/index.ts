"use server";

import { currentRole, currentUser } from "@/lib/auth-user";
import { db } from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { DateTime } from "luxon";
import { HourlyClientSchema } from "@/schemas/clients";
import { HourlyClientColumns } from "@/app/(dashboard)/hourly-clients/_components/columns";

export async function getHourlyClients() {
  try {
    const loggedUser = await currentUser();

    const clients = await db.client.findMany({
      where: {
        clientCategory: "HOURLY",
        isActive: true,
        parkingLotId: loggedUser?.parkingLotId!,
      },
      select: {
        id: true,
        plate: true,
        entryDate: true,
        vehicleType: {
          select: {
            id: true,
            name: true,
          },
        },
        clientType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return clients;
  } catch (error) {
    return [];
  }
}

export async function deleteHourlyClient(id: string) {
  try {
    const role = await currentRole();

    if (role !== "SuperAdmin" && role !== "Admin") {
      return { error: "Proceso no autorizado." };
    }

    const existingUser = await db.client.findUnique({
      where: { id, clientCategory: "HOURLY" },
    });

    if (!existingUser) {
      return { error: "El cliente a eliminar no existe." };
    }

    await db.client.delete({
      where: { id, clientCategory: "HOURLY" },
    });

    revalidatePath("/");
    revalidatePath("/monthly-clients");
    return { success: "Cliente eliminado." };
  } catch (error) {
    return { error: "Algo salió mal en el proceso." };
  }
}

export async function createHourlyClient(
  values: z.infer<typeof HourlyClientSchema>
) {
  const result = HourlyClientSchema.safeParse(values);

  if (result.error) {
    return { error: "Datos inválidos." };
  }

  try {
    const loggedUser = await currentUser();

    if (!loggedUser) {
      return { error: "Proceso no autorizado." };
    }

    const { plate, vehicleTypeId, clientTypeId } = result.data;

    const existingClient = await db.client.findFirst({
      where: { plate, isActive: true, parkingLotId: loggedUser.parkingLotId! },
    });

    if (existingClient) {
      return {
        error: `El vehículo con plata ${plate}, ya se encuentra registrado.`,
      };
    }

    const fee = await db.fee.findFirst({
      where: {
        clientTypeId,
        vehicleTypeId,
        feeType: "HOURLY",
        parkingLotId: loggedUser.parkingLotId!,
      },
      select: {
        price: true,
      },
    });

    if (!fee) {
      return {
        error:
          "La tarifa para el tipo de cliente y vehículo especificado, no existe.",
      };
    }

    // Obtiene la fecha actual y ajusta a la zona horaria de Colombia
    const currentDate = DateTime.now().setZone("America/Bogota");
    const entryDate = currentDate.toJSDate();

    await db.client.create({
      data: {
        plate,
        clientTypeId,
        vehicleTypeId,
        clientCategory: "HOURLY",
        entryDate,
        parkingLotId: loggedUser.parkingLotId!,
      },
    });

    revalidatePath("/");
    revalidatePath("/hourly-clients");
    return { success: "Cliente creado." };
  } catch (error) {
    return { error: "Algo salió mal en el proceso." };
  }
}

export async function updateHourlyClient(
  values: z.infer<typeof HourlyClientSchema>,
  clientId: string
) {
  const result = HourlyClientSchema.safeParse(values);

  if (result.error) {
    return { error: "Datos inválidos." };
  }

  try {
    const loggedUser = await currentUser();

    if (!loggedUser) {
      return { error: "Proceso no autorizado." };
    }

    const { plate, vehicleTypeId, clientTypeId } = result.data;

    const fee = await db.fee.findFirst({
      where: {
        clientTypeId,
        vehicleTypeId,
        feeType: "HOURLY",
        parkingLotId: loggedUser.parkingLotId!,
      },
      select: {
        price: true,
      },
    });

    if (!fee) {
      return {
        error:
          "La tarifa para el tipo de cliente y vehículo especificado, no existe.",
      };
    }

    await db.client.update({
      where: {
        id: clientId,
        isActive: true,
        parkingLotId: loggedUser.parkingLotId!,
      },
      data: {
        plate,
        clientTypeId,
        vehicleTypeId,
      },
    });

    revalidatePath("/");
    revalidatePath("/hourly-clients");
    return { success: "Cliente actualizado." };
  } catch (error) {
    return { error: "Algo salió mal en el proceso." };
  }
}

export async function calculateTotalFee(clientData: HourlyClientColumns) {
  try {
    const loggedUser = await currentUser();

    // Obtiene los datos del cliente
    const client = await db.client.findUnique({
      where: {
        id: clientData.id,
        parkingLotId: loggedUser?.parkingLotId!,
        clientCategory: "HOURLY",
      },
      select: {
        entryDate: true,
        clientType: {
          select: {
            hasHourlyLimit: true,
            hourlyLimit: true,
          },
        },
      },
    });

    if (!client || !client.entryDate) {
      return {
        error:
          "Datos de cliente no válidos o el cliente no es de tipo por hora",
      };
    }

    // Establece la hora de salida como la hora actual
    const exitDate = DateTime.now().setZone("America/Bogota");

    const entryDate = DateTime.fromJSDate(client?.entryDate!).setZone(
      "America/Bogota"
    );

    // Calcula la diferencia en horas y minutos
    const diffInHoursAndMinutes = exitDate.diff(entryDate, [
      "hours",
      "minutes",
    ]);
    const diffInHours = Math.floor(diffInHoursAndMinutes.hours);
    const diffInMinutes = Math.floor(diffInHoursAndMinutes.minutes);

    const roundedHours = diffInMinutes > 0 ? diffInHours + 1 : diffInHours;

    const hoursToCharge = client.clientType.hasHourlyLimit
      ? Math.min(roundedHours, client.clientType.hourlyLimit!)
      : roundedHours;

    // Obtiene la tarifa del cliente
    const fee = await db.fee.findFirst({
      where: {
        feeType: "HOURLY",
        clientTypeId: clientData.clientTypeId,
        vehicleTypeId: clientData.vehicleTypeId,
        parkingLotId: loggedUser?.parkingLotId!,
      },
    });

    if (!fee) {
      return { error: "No se encontró una tarifa válida para el cliente" };
    }

    // Calcula el monto total sin decimales
    const totalAmount = Math.floor(hoursToCharge * fee.price);

    // Actualiza la hora de salida del cliente en la base de datos
    await db.client.update({
      where: { id: clientData.id },
      data: {
        totalPaid: totalAmount,
        exitDate: exitDate.toJSDate(),
        isActive: false,
      },
    });

    revalidatePath("/");
    revalidatePath("/hourly-clients");
    return { success: "Pago registrado con éxito." };
  } catch (error) {
    return { error: "Algo salió mal en el proceso." };
  }
}

export async function getPaidDetails(clientData: HourlyClientColumns) {
  try {
    const loggedUser = await currentUser();

    // Obtiene los datos del cliente
    const client = await db.client.findUnique({
      where: { id: clientData.id, parkingLotId: loggedUser?.parkingLotId! },
      include: { clientType: true },
    });

    // Establece la hora de entrada en la zona horaria de Colombia
    const entryDate = DateTime.fromJSDate(client?.entryDate!).setZone(
      "America/Bogota"
    );

    // Establece la hora de salida en la zona horaria de Colombia (hora actual)
    const exitDate = DateTime.now().setZone("America/Bogota");

    // Calcula la diferencia en horas y minutos
    const diffInHoursAndMinutes = exitDate.diff(entryDate, [
      "hours",
      "minutes",
    ]);
    const diffInHours = Math.floor(diffInHoursAndMinutes.hours);
    const diffInMinutes = Math.floor(diffInHoursAndMinutes.minutes);

    const roundedHours = diffInMinutes > 0 ? diffInHours + 1 : diffInHours;

    const hoursToCharge = client?.clientType.hasHourlyLimit
      ? Math.min(roundedHours, client.clientType.hourlyLimit!)
      : roundedHours;

    // Obtiene la tarifa del cliente
    const fee = await db.fee.findFirst({
      where: {
        clientTypeId: clientData.clientTypeId,
        vehicleTypeId: clientData.vehicleTypeId,
        feeType: "HOURLY",
        parkingLotId: loggedUser?.parkingLotId!,
      },
      include: {
        clientType: true,
      },
    });

    if (!fee) {
      return {
        stayDuration: `0 horas 0 minutos`,
        totalAmount: 0,
      };
    }

    // Calcula el monto total sin decimales
    const totalAmount = Math.floor(hoursToCharge * fee.price);

    // Formatea el tiempo de estancia en horas y minutos
    const stayDuration = `${diffInHours} horas ${diffInMinutes} minutos`;

    return {
      stayDuration,
      totalAmount,
    };
  } catch (error) {
    return {
      stayDuration: `0 horas 0 minutos`,
      totalAmount: 0,
    };
  }
}
