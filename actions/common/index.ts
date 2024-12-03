"use server";

import { currentUser } from "@/lib/auth-user";
import { db } from "@/lib/db";
import { getCurrentParkingLot } from "../business-config";

export async function getClientsCount() {
  try {
    const loggedUser = await currentUser();

    const monthlyClientsCount = await db.client.count({
      where: {
        clientCategory: "MONTHLY",
        isActive: true,
        parkingLotId: loggedUser?.parkingLotId!,
      },
    });

    const hourlyClientsCount = await db.client.count({
      where: {
        clientCategory: "HOURLY",
        isActive: true,
        parkingLotId: loggedUser?.parkingLotId!,
      },
    });

    return {
      monthlyClientsCount,
      hourlyClientsCount,
    };
  } catch {
    return {
      monthlyClientsCount: 0,
      hourlyClientsCount: 0,
    };
  }
}

export async function getEmployees() {
  try {
    const parkingLot = await getCurrentParkingLot();

    const employees = await db.user.findMany({
      where: {
        parkingLotId: parkingLot?.id!,
      },
      include: {
        workDays: {
          include: {
            shifts: true
          }
        },
      },
    });

    return employees;
  } catch (error) {
    return [];
  }
}
