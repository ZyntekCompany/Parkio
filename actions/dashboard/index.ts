"use server";

import { currentUser } from "@/lib/auth-user";
import { db } from "@/lib/db";

import { DateTime } from "luxon";

export async function getDailyChartData() {
  const loggedUser = await currentUser();

  // Crear la fecha de inicio en la zona horaria de Colombia (12:00 am)
  const startDate = DateTime.now()
    .setZone("America/Bogota")
    .startOf("day")
    .toJSDate();

  // Crear la fecha de fin en la zona horaria de Colombia (11:59:59 pm)
  const endDate = DateTime.now()
    .setZone("America/Bogota")
    .endOf("day")
    .toJSDate();

  // Obtener los datos de clientes por hora (salidas)
  const hourlyClients = await db.client.findMany({
    where: {
      clientCategory: "HOURLY",
      parkingLotId: loggedUser?.parkingLotId!,
      exitDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: { exitDate: true, totalPaid: true },
  });

  // Obtener los datos de clientes mensuales (creados)
  const monthlyClients = await db.client.findMany({
    where: {
      clientCategory: "MONTHLY",
      parkingLotId: loggedUser?.parkingLotId!,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: { createdAt: true, totalPaid: true },
  });

  // Crear un arreglo con las ganancias por cada hora desde las 4:00am hasta las 11:00pm
  const earningsByHour = Array(24).fill(0); // 20 horas de 4:00am a 11:00pm

  // Acumular ganancias por hora de clientes por hora
  hourlyClients.forEach((client) => {
    if (client.exitDate) {
      const hour = DateTime.fromJSDate(client.exitDate).setZone(
        "America/Bogota"
      ).hour;
      if (hour >= 4 && hour <= 23) {
        earningsByHour[hour] += client.totalPaid; // Ajustar el índice al rango 4-23
      }
    }
  });

  // Acumular ganancias por hora de clientes mensuales
  monthlyClients.forEach((client) => {
    if (client.createdAt) {
      const hour = DateTime.fromJSDate(client.createdAt).setZone(
        "America/Bogota"
      ).hour;

      earningsByHour[hour] += client.totalPaid; // Ajustar el índice al rango 4-23
    }
  });

  // Función para convertir el formato de 24 horas a 12 horas con AM/PM
  const formatHour = (hour: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:00 ${period}`;
  };

  // Formatear los datos para el gráfico desde 12 AM hasta 11:59 PM
  const chartData = earningsByHour.map((earnings, index) => ({
    hour: formatHour(index), // Convertir el índice al formato de hora comenzando desde 4
    earnings, // Ganancias acumuladas por hora
  }));

  return chartData;
}

export async function getDailyEarnings() {
  const loggedUser = await currentUser();

  // Obtener la fecha de hoy al comienzo del día en la zona horaria de Colombia
  const todayStart = DateTime.now()
    .setZone("America/Bogota")
    .startOf("day")
    .toJSDate();

  // Obtener la fecha de hoy al final del día en la zona horaria de Colombia
  const todayEnd = DateTime.now()
    .setZone("America/Bogota")
    .endOf("day")
    .toJSDate();

  // Obtener las ganancias del día para clientes por hora
  const hourlyEarnings = await db.client.aggregate({
    _sum: { totalPaid: true },
    where: {
      parkingLotId: loggedUser?.parkingLotId!,
      clientCategory: "HOURLY",
      exitDate: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });

  // Obtener las ganancias del día para clientes mensuales
  const monthlyEarnings = await db.client.aggregate({
    _sum: { totalPaid: true },
    where: {
      parkingLotId: loggedUser?.parkingLotId!,
      clientCategory: "MONTHLY",
      createdAt: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });

  // Obtener las ganancias totales del día
  const totalEarnings = await db.client.aggregate({
    _sum: { totalPaid: true },
    where: {
      parkingLotId: loggedUser?.parkingLotId!,
      OR: [
        {
          clientCategory: "HOURLY",
          exitDate: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
        {
          clientCategory: "MONTHLY",
          createdAt: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      ],
    },
  });

  // Obtener el número total de clientes que han salido hoy
  const hourlyClientsCount = await db.client.count({
    where: {
      parkingLotId: loggedUser?.parkingLotId!,
      clientCategory: "HOURLY",
      exitDate: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });

  // Obtener el número total de clientes mensuales que se registraron hoy
  const monthlyClientsCount = await db.client.count({
    where: {
      parkingLotId: loggedUser?.parkingLotId!,
      clientCategory: "MONTHLY",
      createdAt: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });

  // Obtener el número total de clientes por hora que aún no han salido
  const hourlyClientsStillInParking = await db.client.count({
    where: {
      parkingLotId: loggedUser?.parkingLotId!,
      clientCategory: "HOURLY",
      exitDate: null, // Clientes que aún no han registrado una fecha de salida
      createdAt: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });

  return {
    hourlyClientsStillInParking,
    hourlyClientsCount, // Número total de clientes que han salido hoy
    monthlyClientsCount, // Número total de clientes mensuales que se registraron hoy
    hourlyEarnings: hourlyEarnings._sum.totalPaid || 0,
    monthlyEarnings: monthlyEarnings._sum.totalPaid || 0,
    totalEarnings: totalEarnings._sum.totalPaid || 0,
  };
}

export async function getFeesData() {
  const loggedUser = await currentUser();

  const clientTypes = await db.clientType.findMany({
    where: {
      parkingLotId: loggedUser?.parkingLotId!,
    },
    select: {
      name: true,
    },
  });

  const fees = await db.fee.findMany({
    where: {
      parkingLotId: loggedUser?.parkingLotId!,
    },
    select: {
      id: true,
      feeType: true,
      price: true,
      clientType: {
        select: {
          name: true,
        },
      },
      vehicleType: {
        select: {
          name: true,
        },
      },
    },
  });

  return {
    clientTypes,
    fees,
  };
}
