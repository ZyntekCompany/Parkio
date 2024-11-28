"use server";

import { currentUser } from "@/lib/auth-user";
import { db } from "@/lib/db";

export async function getParkingLotName() {
  try {
    const parkingLot = await db.parkingLot.findFirst();

    if (!parkingLot) {
      return "";
    }

    return parkingLot.name;
  } catch {
    return "";
  }
}

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
  } catch (error) {
    return {
      monthlyClientsCount: 0,
      hourlyClientsCount: 0,
    };
  }
}
