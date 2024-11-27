"use server"

import { db } from "@/lib/db"

export async function getParkingLotName() {
  try {
    const parkingLot = await db.parkingLot.findFirst()

    if (!parkingLot) {
      return ''
    }

    return parkingLot.name
  } catch {
    return ''
  }
}