import React from "react";
import { differenceInDays, format } from "date-fns";
import { es } from "date-fns/locale";

import { columns, MonthlyClientColumns } from "./columns";
import { getMonthlyClients } from "@/actions/monthly-clients";
import { DataTable } from "@/components/common/data-table";

export async function MonthlyClientsTable() {
  const clients = await getMonthlyClients();

  const formattedClients: MonthlyClientColumns[] = clients.map((client) => {
    const createdAt = new Date(client.createdAt);
    const endDate = new Date(client.endDate!);
    const today = new Date()

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
      createdAt: format(createdAt, "d 'de' MMMM, yyyy", { locale: es }),
      endDate: format(endDate, "d 'de' MMMM, yyyy", { locale: es }),
      serviceDays: differenceInDays(endDate, today),
    };
  });

  return (
    <DataTable
      searchKey="plate"
      searchPlaceholder="Buscar por placa..."
      columns={columns}
      data={formattedClients}
    />
  );
}
