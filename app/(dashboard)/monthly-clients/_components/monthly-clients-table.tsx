import React from "react";
import { DateTime } from "luxon";

import { columns, MonthlyClientColumns } from "./columns";
import { getMonthlyClients } from "@/actions/monthly-clients";
import { DataTable } from "@/components/common/data-table";

export async function MonthlyClientsTable() {
  const clients = await getMonthlyClients();

  const formattedClients: MonthlyClientColumns[] = clients.map((client) => {
    const createdAt = DateTime.fromJSDate(new Date(client.createdAt)).setZone(
      "America/Bogota"
    );
    const endDate = DateTime.fromJSDate(new Date(client.endDate!)).setZone(
      "America/Bogota"
    );
    const today = DateTime.now().setZone("America/Bogota");

    return {
      id: client.id,
      clientTypeId: client.clientType.id,
      vehicleTypeId: client.vehicleType.id,
      monthsReserved: client.monthsReserved!,
      name: client.name!,
      email: client.email!,
      document: client.document!,
      phone: client.phone!,
      plate: client.plate,
      vehicleType: client.vehicleType.name,
      clientType: client.clientType.name,
      createdAt: createdAt.setLocale("es").toFormat("d 'de' MMMM, yyyy"),
      endDate: endDate.setLocale("es").toFormat("d 'de' MMMM, yyyy"),
      serviceDays: Math.ceil(endDate.diff(today, "days").days),
    };
  });

  return (
    <DataTable
      inputPlateMask
      searchKey="plate"
      searchPlaceholder="Buscar por placa..."
      columns={columns}
      data={formattedClients}
    />
  );
}
