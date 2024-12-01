import { monthlyServiceExpirationReminderEmail } from "@/lib/brevo";
import { db } from "@/lib/db";
import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const now = DateTime.now().setZone("America/Bogota").toJSDate();
    const fiveDaysFromNow = DateTime.now()
      .setZone("America/Bogota")
      .plus({ days: 5 })
      .toJSDate();

    try {
      const clients = await db.client.findMany({
        where: {
          clientCategory: "MONTHLY",
          isActive: true,
          endDate: {
            gte: now,
            lte: fiveDaysFromNow,
          },
          reminderSent: false,
        },
        include: {
          parkingLot: true,
        },
      });

      console.log(clients);

      for (const client of clients) {
        if (client.email) {
          const endDate = DateTime.fromJSDate(
            new Date(client.endDate!)
          ).setZone("America/Bogota");
          const today = DateTime.now().setZone("America/Bogota");
          const remainingDays = Math.ceil(endDate.diff(today, "days").days);

          monthlyServiceExpirationReminderEmail(
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
        }
      }
    } catch {
      return NextResponse.json({ message: "Algo salió mal." }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Función ejecutada." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en la tarea programada:", error);

    return NextResponse.json(
      { message: "Error al ejecutar la tarea" },
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
