"use server";

import { currentRole, currentUser } from "@/lib/auth-user";
import { db } from "@/lib/db";
import { MonthlyClientSchema } from "@/schemas/clients";
import { z } from "zod";
import { monthlyPaymentEmail } from "@/lib/brevo";
import { revalidatePath } from "next/cache";
import { DateTime } from "luxon";

export async function getMonthlyClients() {
  try {
    const loggedUser = await currentUser();

    const clients = await db.client.findMany({
      where: {
        clientCategory: "MONTHLY",
        isActive: true,
        parkingLotId: loggedUser?.parkingLotId!,
      },
      select: {
        id: true,
        name: true,
        document: true,
        phone: true,
        email: true,
        plate: true,
        createdAt: true,
        endDate: true,
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
    });

    return clients;
  } catch (error) {
    return [];
  }
}

export async function createMonthlyClient(
  values: z.infer<typeof MonthlyClientSchema>
) {
  const result = MonthlyClientSchema.safeParse(values);

  if (result.error) {
    return { error: "Datos inválidos." };
  }

  try {
    const loggedUser = await currentUser();

    if (!loggedUser) {
      return { error: "Proceso no autorizado." };
    }

    const { name, email, phone, document, plate, vehicleTypeId, clientTypeId } =
      result.data;

    const existingClient = await db.client.findMany({
      where: { plate, isActive: true },
    });

    if (existingClient.length > 0) {
      return {
        error: `El vehículo con plata ${plate}, ya se encuentra registrado.`,
      };
    }

    const fee = await db.fee.findFirst({
      where: {
        clientTypeId,
        vehicleTypeId,
        feeType: "MONTHLY",
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

    // Obtén la fecha actual y ajusta a la zona horaria de Colombia
    const currentDate = DateTime.now().setZone("America/Bogota");
    const startDate = currentDate.toJSDate();

    // Calcula la fecha de finalización sumando un mes
    const endDate = currentDate.plus({ months: 1 }).toJSDate();

    // Crea el cliente mensual en la base de datos
    const newClient = await db.client.create({
      data: {
        name,
        document,
        phone,
        plate,
        email,
        clientTypeId,
        vehicleTypeId,
        clientCategory: "MONTHLY",
        startDate,
        endDate,
        totalPaid: fee?.price || 0,
        parkingLotId: loggedUser.parkingLotId!,
      },
      include: {
        parkingLot: {
          select: {
            name: true,
          },
        },
      },
    });

    monthlyPaymentEmail(
      newClient.email!,
      newClient.name!,
      newClient.startDate!,
      newClient.endDate!,
      newClient.totalPaid!,
      newClient.parkingLot.name
    );

    revalidatePath("/");
    revalidatePath("/monthly-clients");
    return { success: "Cliente creado." };
  } catch (error) {
    console.log(error)
    return { error: "Algo salió mal en el proceso." };
  }
}

export async function deleteMonthlyClient(id: string) {
  try {
    const role = await currentRole();

    if (role !== "SuperAdmin" && role !== "Admin") {
      return { error: "Proceso no autorizado." };
    }

    const existingUser = await db.client.findUnique({
      where: { id, clientCategory: "MONTHLY" },
    });

    if (!existingUser) {
      return { error: "El cliente a eliminar no existe." };
    }

    await db.client.delete({
      where: { id, clientCategory: "MONTHLY" },
    });

    revalidatePath("/");
    revalidatePath("/monthly-clients");
    return { success: "Cliente eliminado." };
  } catch (error) {
    return { error: "Algo salió mal en el proceso." };
  }
}

export async function updateMonthlyClient(
  values: z.infer<typeof MonthlyClientSchema>,
  clientId: string
) {
  const result = MonthlyClientSchema.safeParse(values);

  if (result.error) {
    return { error: "Datos inválidos." };
  }

  try {
    const loggedUser = await currentUser();

    if (!loggedUser) {
      return { error: "Proceso no autorizado." };
    }

    const existingMonthlyClient = await db.client.findUnique({
      where: { id: clientId, clientCategory: "MONTHLY" },
    });

    if (!existingMonthlyClient) {
      return { error: "El cliente que quieres actualizar no existe." };
    }

    const { name, email, phone, document, plate, vehicleTypeId, clientTypeId } =
      result.data;

    const fee = await db.fee.findFirst({
      where: {
        clientTypeId,
        vehicleTypeId,
        feeType: "MONTHLY",
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

    // Crea el cliente mensual en la base de datos
    await db.client.update({
      where: {
        id: clientId,
        isActive: true,
      },
      data: {
        name,
        document,
        phone,
        plate,
        email,
        clientTypeId,
        vehicleTypeId,
        totalPaid: fee.price,
      },
    });

    revalidatePath("/");
    revalidatePath("/monthly-clients");
    return { success: "Cliente actualizado." };
  } catch (error) {
    return { error: "Algo salió mal en el proceso." };
  }
}
