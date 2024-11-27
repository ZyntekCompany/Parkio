"use server";

import { currentUser } from "@/lib/auth-user";
import { db } from "@/lib/db";
import { MonthlyClientSchema } from "@/schemas/clients";
import { z } from "zod";
import { monthlyPaymentEmail } from "@/lib/brevo";
import { revalidatePath } from "next/cache";
import { DateTime } from "luxon";
import { getParkingLotName } from "../common";

export async function getMonthlyClients() {
  try {
    const clients = await db.client.findMany({
      where: {
        clientCategory: "MONTHLY",
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

    const existingClient = await db.client.findFirst({
      where: { plate, isActive: true },
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
        feeType: "MONTHLY",
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
        totalPaid: fee.price,
      },
    });

    const parkingName = await getParkingLotName();

    monthlyPaymentEmail(
      newClient.email!,
      newClient.name!,
      newClient.startDate!,
      newClient.endDate!,
      newClient.totalPaid!,
      parkingName
    );

    revalidatePath("/");
    revalidatePath("/monthly-clients");
    return { success: "Cliente creado." };
  } catch (error) {
    return { error: "Algo salió mal en el proceso." };
  }
}
