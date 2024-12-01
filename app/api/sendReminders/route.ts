import { checkAndSendReminders } from "@/actions/monthly-clients";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await checkAndSendReminders();
    return NextResponse.json({ message: "Función ejecutada." });
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
