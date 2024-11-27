"use server";

import { db } from "@/lib/db";

import { eachDayOfInterval, format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

// La estoy usando
export async function getDailyChartData() {
  // Obtener los datos de clientes por hora
  const hourlyClients = await db.client.findMany({
    where: { clientCategory: "HOURLY" },
    select: { exitDate: true, totalPaid: true },
  });

  // Obtener los datos de clientes mensuales
  const monthlyClients = await db.client.findMany({
    where: { clientCategory: "MONTHLY" },
    select: { createdAt: true, totalPaid: true },
  });

  // Crear un arreglo con las ganancias por cada hora
  const earningsByHour = Array(20).fill(0); // Arreglo con 24 horas

  // Acumular ganancias por hora de clientes horarios
  hourlyClients.forEach((client) => {
    if (client.exitDate) {
      const hour = client.exitDate.getHours();
      if (hour >= 4 && hour <= 23) {
        earningsByHour[hour - 4] += client.totalPaid; // Ajustar el índice al rango 4-23
      }
    }
  });

  // Acumular ganancias por hora de clientes mensuales
  monthlyClients.forEach((client) => {
    if (client.createdAt) {
      const hour = client.createdAt.getHours();
      if (hour >= 4 && hour <= 23) {
        earningsByHour[hour - 4] += client.totalPaid; // Ajustar el índice al rango 4-23
      }
    }
  });

  // Función para convertir el formato de 24 horas a 12 horas con AM/PM
  const formatHour = (hour: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:00 ${period}`;
  };

  // Formatear los datos para el gráfico desde 4 AM hasta 12 AM
  const chartData = earningsByHour.map((earnings, index) => ({
    hour: formatHour(index + 4), // Convertir el índice al formato de hora comenzando desde 4
    earnings, // Ganancias acumuladas por hora
  }));

  return chartData;
}

// La estoy usando
export async function getDailyEarnings() {
  // Obtener la fecha de hoy al comienzo del día en la zona horaria de Colombia
  const todayStart = toZonedTime(new Date(), "America/Bogota");
  todayStart.setHours(0, 0, 0, 0);

  // Obtener la fecha de hoy al final del día en la zona horaria de Colombia
  const todayEnd = toZonedTime(new Date(), "America/Bogota");
  todayEnd.setHours(23, 59, 59, 999);

  // Obtener las ganancias del día para clientes horarios
  const hourlyEarnings = await db.client.aggregate({
    _sum: { totalPaid: true },
    where: {
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

// La estoy usando
export async function getFeesData() {
  const clientTypes = await db.clientType.findMany({
    select: {
      name: true,
    },
  });

  const fees = await db.fee.findMany({
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

// export async function getDailyEarnings() {
//   // Obtener la fecha de hoy al comienzo del día
//   const todayStart = new Date();
//   todayStart.setHours(0, 0, 0, 0);

//   // Obtener la fecha de hoy al final del día
//   const todayEnd = new Date();
//   todayEnd.setHours(23, 59, 59, 999);

//   // Obtener las ganancias del día para clientes horarios
//   const hourlyEarnings = await db.client.aggregate({
//     _sum: { totalPaid: true },
//     where: {
//       clientCategory: "HOURLY",
//       exitDate: {
//         gte: todayStart,
//         lte: todayEnd,
//       },
//     },
//   });

//   // Obtener las ganancias del día para clientes mensuales
//   const monthlyEarnings = await db.client.aggregate({
//     _sum: { totalPaid: true },
//     where: {
//       clientCategory: "MONTHLY",
//       createdAt: {
//         gte: todayStart,
//         lte: todayEnd,
//       },
//     },
//   });

//   // Obtener las ganancias totales del día
//   const totalEarnings = await db.client.aggregate({
//     _sum: { totalPaid: true },
//     where: {
//       OR: [
//         {
//           clientCategory: "HOURLY",
//           exitDate: {
//             gte: todayStart,
//             lte: todayEnd,
//           },
//         },
//         {
//           clientCategory: "MONTHLY",
//           createdAt: {
//             gte: todayStart,
//             lte: todayEnd,
//           },
//         },
//       ],
//     },
//   });

//   // Obtener el número total de clientes que han salido hoy
//   const hourlyClientsCount = await db.client.count({
//     where: {
//       clientCategory: "HOURLY",
//       exitDate: {
//         gte: todayStart,
//         lte: todayEnd,
//       },
//     },
//   });

//   // Obtener el número total de clientes mensuales que se registraron hoy
//   const monthlyClientsCount = await db.client.count({
//     where: {
//       clientCategory: "MONTHLY",
//       createdAt: {
//         gte: todayStart,
//         lte: todayEnd,
//       },
//     },
//   });

//   return {
//     hourlyClientsCount, // Número total de clientes que han salido hoy
//     monthlyClientsCount, // Número total de clientes mensuales que se registraron hoy
//     hourlyEarnings: hourlyEarnings._sum.totalPaid || 0,
//     monthlyEarnings: monthlyEarnings._sum.totalPaid || 0,
//     totalEarnings: totalEarnings._sum.totalPaid || 0,
//   };
// }

export async function getDailyClientCounts() {
  // Obtener la fecha de hoy al comienzo del día
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // Obtener la fecha de hoy al final del día
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // Obtener el número total de clientes que han salido hoy
  const hourlyClientsCount = await db.client.count({
    where: {
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
      clientCategory: "MONTHLY",
      createdAt: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });

  return {
    hourlyClientsCount, // Número total de clientes que han salido hoy
    monthlyClientsCount, // Número total de clientes mensuales que se registraron hoy
  };
}

// export async function getDailyClientCounts() {
//   // Obtener la fecha de hoy al comienzo del día
//   const todayStart = new Date();
//   todayStart.setHours(0, 0, 0, 0);

//   // Obtener la fecha de hoy al final del día
//   const todayEnd = new Date();
//   todayEnd.setHours(23, 59, 59, 999);

//   // Obtener el número de clientes por hora que entraron hoy
//   const hourlyClients = await db.client.groupBy({
//     by: ["entryDate"],
//     _count: {
//       id: true,
//     },
//     where: {
//       clientCategory: "HOURLY",
//       exitDate: {
//         gte: todayStart,
//         lte: todayEnd,
//       },
//     },
//   });

//   // Obtener el número de clientes mensuales que se registraron hoy
//   const monthlyClients = await db.client.groupBy({
//     by: ["createdAt"],
//     _count: {
//       id: true,
//     },
//     where: {
//       clientCategory: "MONTHLY",
//       createdAt: {
//         gte: todayStart,
//         lte: todayEnd,
//       },
//     },
//   });

//   // Formatear los resultados para obtener el número de clientes por hora
//   const hourlyClientCounts = hourlyClients.map((entry) => ({
//     hour: entry.entryDate.getHours(),
//     count: entry._count.id,
//   }));

//   const monthlyClientCount = monthlyClients.reduce(
//     (total, entry) => total + entry._count.id,
//     0
//   );

//   return {
//     hourlyClientCounts, // Número de clientes por hora que entraron hoy
//     monthlyClientCount, // Número total de clientes mensuales que se registraron hoy
//   };
// }

// La que estoy usando
export async function getTotalEarnings() {
  const hourlyEarnings = await db.client.aggregate({
    _sum: { totalPaid: true },
    where: { clientCategory: "HOURLY" },
  });

  const monthlyEarnings = await db.client.aggregate({
    _sum: { totalPaid: true },
    where: { clientCategory: "MONTHLY" },
  });

  const totalEarnings = await db.client.aggregate({
    _sum: { totalPaid: true },
  });

  return {
    hourlyEarnings: hourlyEarnings._sum.totalPaid || 0,
    monthlyEarnings: monthlyEarnings._sum.totalPaid || 0,
    totalEarnings: totalEarnings._sum.totalPaid || 0,
  };
}

// Función para obtener datos generales de ganancias
// export async function getGeneralEarningsData() {
//   // Obtener el total de ganancias de clientes por hora
//   const hourlyClients = await db.client.findMany({
//     where: { clientCategory: "HOURLY" },
//     select: { totalPaid: true, entryDate: true },
//   });

//   // Calcular las ganancias totales del día
//   const totalEarnings = hourlyClients.reduce(
//     (sum, client) => sum + client.totalPaid,
//     0
//   );

//   // Obtener las ganancias por hora entre las 6:00 AM y las 10:00 PM
//   const filteredHourlyEarnings = hourlyClients.filter((client) => {
//     // Filtra los clientes que hayan registrado entrada/salida en el rango deseado
//     const entryHour = client.entryDate?.getHours() ?? 0;
//     return entryHour >= 6 && entryHour < 22;
//   });

//   const hourlyEarnings = filteredHourlyEarnings.reduce(
//     (sum, client) => sum + client.totalPaid,
//     0
//   );

//   // Calcular las ganancias mensuales como una estimación
//   const monthlyEarnings = totalEarnings * 30;

//   return { totalEarnings, hourlyEarnings, monthlyEarnings };
// }

// Función para obtener datos para el gráfico
export async function getChartData() {
  // Obtener los datos de clientes por hora
  const hourlyClients = await db.client.findMany({
    where: { clientCategory: "HOURLY" },
    select: { entryDate: true, totalPaid: true },
  });

  // Crear un arreglo con las ganancias por cada hora
  const earningsByHour = Array(24).fill(0); // Arreglo con 24 horas

  hourlyClients.forEach((client) => {
    if (client.entryDate) {
      const hour = client.entryDate.getHours();
      earningsByHour[hour] += client.totalPaid;
    }
  });

  // Formatear los datos para el gráfico
  const chartData = earningsByHour.map((earnings, index) => ({
    hour: `${index.toString().padStart(2, "0")}:00`,
    earnings,
  }));

  return chartData;
}

export async function getMonthlyProfits() {
  // Obtener la fecha actual y el primer día del mes
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Crear un arreglo de todas las fechas del mes hasta hoy
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth,
    end: today,
  });

  // Obtener clientes por hora que salieron este mes
  const hourlyProfits = await db.client.findMany({
    where: {
      clientCategory: "HOURLY",
      exitDate: {
        gte: startOfMonth,
        lte: today,
      },
    },
    select: {
      exitDate: true,
      totalPaid: true,
    },
  });

  // Obtener clientes mensuales que pagaron este mes
  const monthlyProfits = await db.client.findMany({
    where: {
      clientCategory: "MONTHLY",
      serviceExpirationTime: {
        gte: startOfMonth,
        lte: today,
      },
    },
    select: {
      serviceExpirationTime: true,
      totalPaid: true,
    },
  });

  // Crear un objeto para almacenar las ganancias por día
  const dailyProfits: { [key: string]: number } = {};

  daysInMonth.forEach((day) => {
    const formattedDate = format(day, "yyyy-MM-dd");
    dailyProfits[formattedDate] = 0;
  });

  // Sumar las ganancias por día para clientes por hora
  hourlyProfits.forEach((client) => {
    const formattedDate = format(client.exitDate!, "yyyy-MM-dd");
    dailyProfits[formattedDate] += client.totalPaid;
  });

  // Sumar las ganancias por día para clientes mensuales
  monthlyProfits.forEach((client) => {
    const formattedDate = format(client.serviceExpirationTime!, "yyyy-MM-dd");
    dailyProfits[formattedDate] += client.totalPaid;
  });

  // Calcular el total y el promedio de las ganancias
  const totalProfits = Object.values(dailyProfits).reduce(
    (acc, profit) => acc + profit,
    0
  );
  const averageProfits = totalProfits / daysInMonth.length;

  return {
    dailyProfits,
    totalProfits,
    averageProfits,
  };
}

export async function getDailyProfits() {
  // Obtener la fecha actual y el inicio del día
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Inicio del día

  // Obtener clientes por hora que salieron hoy y calcular las ganancias
  const hourlyProfits = await db.client.findMany({
    where: {
      clientCategory: "HOURLY",
      exitDate: {
        gte: today,
      },
    },
    select: {
      totalPaid: true,
    },
  });

  // Sumar las ganancias por hora
  const hourlyTotal = hourlyProfits.reduce(
    (acc, client) => acc + client.totalPaid,
    0
  );

  // Obtener clientes mensuales que pagaron hoy
  const monthlyProfits = await db.client.findMany({
    where: {
      clientCategory: "MONTHLY",
      serviceExpirationTime: {
        gte: today,
      },
    },
    select: {
      totalPaid: true,
    },
  });

  // Sumar las ganancias mensuales
  const monthlyTotal = monthlyProfits.reduce(
    (acc, client) => acc + client.totalPaid,
    0
  );

  // Calcular el total de ganancias
  const totalProfits = hourlyTotal + monthlyTotal;

  return {
    hourlyTotal,
    monthlyTotal,
    totalProfits,
  };
}
// Consulta para obtener las ganancias
export async function getEarnings() {
  const dailyEarnings = await db.client.aggregate({
    _sum: { totalPaid: true },
    where: {
      clientCategory: "HOURLY",
      entryDate: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    },
  });

  const monthlyEarnings = await db.client.aggregate({
    _sum: { totalPaid: true },
    where: {
      clientCategory: "HOURLY",
      entryDate: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    },
  });

  const totalEarnings = await db.client.aggregate({
    _sum: { totalPaid: true },
  });

  const incomeByCategory = await db.fee.groupBy({
    by: ["feeType"],
    _sum: { price: true },
  });

  return {
    daily: dailyEarnings._sum.totalPaid || 0,
    monthly: monthlyEarnings._sum.totalPaid || 0,
    total: totalEarnings._sum.totalPaid || 0,
    incomeByCategory: incomeByCategory.map((cat) => ({
      label: cat.feeType,
      total: cat._sum.price || 0,
    })),
  };
}

// Consulta para obtener datos de clientes
export async function getClientsData() {
  const hourlyClients = await db.client.count({
    where: { clientCategory: "HOURLY" },
  });

  const monthlyClients = await db.client.count({
    where: { clientCategory: "MONTHLY" },
  });

  return [
    { label: "Por Hora", count: hourlyClients },
    { label: "Mensual", count: monthlyClients },
  ];
}

// Consulta para obtener tipos de vehículos y sus cantidades
export async function getVehicleTypes() {
  const vehicleTypes = await db.vehicleType.findMany({
    include: {
      _count: {
        select: { clients: true },
      },
    },
  });

  return vehicleTypes.map((type) => ({
    name: type.name,
    count: type._count.clients,
  }));
}
