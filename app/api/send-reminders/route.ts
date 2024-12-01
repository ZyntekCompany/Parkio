import { monthlyServiceExpirationReminderEmail } from "@/lib/brevo";
import { db } from "@/lib/db";
import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const zone = "America/Bogota";
  const now = DateTime.now().setZone(zone);
  const fiveDaysFromNow = now.plus({ days: 5 });

  try {
    const clients = await db.client.findMany({
      where: {
        clientCategory: "MONTHLY",
        isActive: true,
        endDate: {
          gte: now.toJSDate(),
          lte: fiveDaysFromNow.toJSDate(),
        },
        reminderSent: false,
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

        const endDate = DateTime.fromJSDate(new Date(client.endDate!)).setZone(zone);
        const remainingDays = Math.ceil(endDate.diff(now, "days").days);

        await monthlyServiceExpirationReminderEmail(
          client.email,
          client.name!,
          client.endDate!,
          remainingDays,
          client.parkingLot.name
        );

        await db.client.update({
          where: { id: client.id },
          data: { reminderSent: true },
        });
      })
    );

    return NextResponse.json(
      { message: "Recordatorios enviados exitosamente." },
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
