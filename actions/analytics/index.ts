"use server";

import { currentUser } from "@/lib/auth-user";
import { db } from "@/lib/db";
import { DateTime } from "luxon";

const TIME_ZONE = "America/Bogota";
const LOCALE = "es";

export async function getMonthlyEarnings() {
  const startOfMonth = DateTime.now().setZone(TIME_ZONE).startOf("month");
  const endOfMonth = DateTime.now().setZone(TIME_ZONE).endOf("month");

  const loggedUser = await currentUser();

  const clients = await db.client.findMany({
    where: {
      parkingLotId: loggedUser?.parkingLotId!,
      createdAt: {
        gte: startOfMonth.toJSDate(),
        lte: endOfMonth.toJSDate(),
      },
    },
    select: {
      createdAt: true,
      clientCategory: true,
      totalPaid: true,
    },
  });

  // Crear un mapa inicial con todos los días del mes
  const dailyEarnings = Array.from({ length: endOfMonth.day }, (_, i) => {
    const day = startOfMonth
      .plus({ days: i })
      .setLocale(LOCALE)
      .toFormat("d 'de' MMMM");
    return {
      day,
      hourlyClientsEarnings: 0,
      monthlyClientsEarnings: 0,
    };
  });

  // Llenar los datos con las ganancias reales
  clients.forEach((client) => {
    const day = DateTime.fromJSDate(client.createdAt)
      .setZone(TIME_ZONE)
      .setLocale(LOCALE)
      .toFormat("d 'de' MMMM");

    const dayIndex = dailyEarnings.findIndex((entry) => entry.day === day);
    if (dayIndex !== -1) {
      if (client.clientCategory === "HOURLY") {
        dailyEarnings[dayIndex].hourlyClientsEarnings += client.totalPaid;
      } else if (client.clientCategory === "MONTHLY") {
        dailyEarnings[dayIndex].monthlyClientsEarnings += client.totalPaid;
      }
    }
  });

  return dailyEarnings;
}

export async function getYearlyEarnings() {
  const startOfYear = DateTime.now().setZone(TIME_ZONE).startOf("year");
  const endOfYear = DateTime.now().setZone(TIME_ZONE).endOf("year");

  const loggedUser = await currentUser();

  const clients = await db.client.findMany({
    where: {
      parkingLotId: loggedUser?.parkingLotId!,
      createdAt: {
        gte: startOfYear.toJSDate(),
        lte: endOfYear.toJSDate(),
      },
    },
    select: {
      createdAt: true,
      clientCategory: true,
      totalPaid: true,
    },
  });

  // Crear un mapa inicial con todos los meses del año
  const monthlyEarnings = Array.from({ length: 12 }, (_, i) => {
    const month = startOfYear
      .plus({ months: i })
      .setLocale(LOCALE)
      .toFormat("MMM");
    return {
      month,
      hourlyClientsEarnings: 0,
      monthlyClientsEarnings: 0,
    };
  });

  // Llenar los datos con las ganancias reales
  clients.forEach((client) => {
    const month = DateTime.fromJSDate(client.createdAt)
      .setZone(TIME_ZONE)
      .setLocale(LOCALE)
      .toFormat("MMM");

    const monthIndex = monthlyEarnings.findIndex(
      (entry) => entry.month === month
    );
    if (monthIndex !== -1) {
      if (client.clientCategory === "HOURLY") {
        monthlyEarnings[monthIndex].hourlyClientsEarnings += client.totalPaid;
      } else if (client.clientCategory === "MONTHLY") {
        monthlyEarnings[monthIndex].monthlyClientsEarnings += client.totalPaid;
      }
    }
  });

  return monthlyEarnings;
}

export async function getClientsCountByCategoryMonth() {
  const loggedUser = await currentUser();

  const startOfMonth = DateTime.now()
    .setZone(TIME_ZONE)
    .startOf("month")
    .toJSDate();
  const endOfMonth = DateTime.now()
    .setZone(TIME_ZONE)
    .endOf("month")
    .toJSDate();

  const clientsByCategory = await db.client.groupBy({
    by: ["clientCategory"],
    where: {
      parkingLotId: loggedUser?.parkingLotId!,
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    _count: {
      clientCategory: true,
    },
  });

  return clientsByCategory.map((entry) => ({
    category:
      entry.clientCategory === "HOURLY" ? "hourlyClients" : "monthlyClients",
    count: entry._count.clientCategory,
    fill:
      entry.clientCategory === "HOURLY"
        ? "hsl(221, 83%, 53%)"
        : "hsl(142, 71%, 45%)",
  }));
}

export async function getClientsCountByCategoryYear() {
  const loggedUser = await currentUser();

  const startOfYear = DateTime.now().setZone(TIME_ZONE).startOf("year");
  const endOfYear = DateTime.now().setZone(TIME_ZONE).endOf("year");

  const clientsByCategory = await db.client.groupBy({
    by: ["clientCategory"],
    where: {
      parkingLotId: loggedUser?.parkingLotId!,
      createdAt: {
        gte: startOfYear.toJSDate(),
        lte: endOfYear.toJSDate(),
      },
    },
    _count: {
      clientCategory: true,
    },
  });

  return clientsByCategory.map((entry) => ({
    category:
      entry.clientCategory === "HOURLY" ? "hourlyClients" : "monthlyClients",
    count: entry._count.clientCategory,
    fill:
      entry.clientCategory === "HOURLY"
        ? "hsl(221, 83%, 53%)"
        : "hsl(142, 71%, 45%)",
  }));
}

export async function getClientsCountByVehicleMonth() {
  const loggedUser = await currentUser();

  const startOfMonth = DateTime.now()
    .setZone(TIME_ZONE)
    .startOf("month")
    .toJSDate();
  const endOfMonth = DateTime.now()
    .setZone(TIME_ZONE)
    .endOf("month")
    .toJSDate();

  const counts = await db.vehicleType.findMany({
    where: {
      parkingLotId: loggedUser?.parkingLotId!,
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    select: {
      name: true,
      _count: {
        select: {
          clients: true,
        },
      },
    },
  });

  return counts.map((item) => ({
    vehicleTypeName: item.name,
    count: item._count.clients,
  }));
}

export async function getClientsCountByClientTypeMonth() {
  const loggedUser = await currentUser();

  const startOfMonth = DateTime.now()
    .setZone(TIME_ZONE)
    .startOf("month")
    .toJSDate();
  const endOfMonth = DateTime.now()
    .setZone(TIME_ZONE)
    .endOf("month")
    .toJSDate();

  const counts = await db.clientType.findMany({
    where: {
      parkingLotId: loggedUser?.parkingLotId!,
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    select: {
      name: true,
      _count: {
        select: {
          clients: true,
        },
      },
    },
  });

  return counts.map((item) => ({
    clientTypeName: item.name,
    count: item._count.clients,
  }));
}
