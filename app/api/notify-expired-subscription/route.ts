import {
  monthlyServiceExpirationReminderEmail,
  monthlyServiceExpiredEmail,
} from "@/lib/brevo";
import { db } from "@/lib/db";
import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const zone = "America/Bogota";
  const now = DateTime.now().setZone(zone);

  try {
    const clients = await db.client.findMany({
      where: {
        clientCategory: "MONTHLY",
        isActive: true,
        endDate: {
          lte: now.toJSDate(),
        },
      },
      include: { parkingLot: true },
    });

    if (clients.length === 0) {
      return NextResponse.json(
        { message: "No hay clientes para notificar." },
        { status: 200 }
      );
    }

    // Procesar clientes en paralelo
    await Promise.all(
      clients.map(async (client) => {
        if (!client.email) return;

        await monthlyServiceExpiredEmail(
          client.email,
          client.name!,
          client.endDate!,
          client.parkingLot.name
        );

        await db.client.update({
          where: { id: client.id },
          data: { isActive: false },
        });
      })
    );

    return NextResponse.json(
      { message: "Notificaciones enviadas exitosamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al procesar clientes:", error);
    return NextResponse.json(
      { message: "Error interno del servidor." },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });

  return new NextResponse(null, { headers });
}
