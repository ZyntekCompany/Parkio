import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { columns, MonthlyClientColumns } from "./columns";
import { getMonthlyClients } from "@/actions/monthly-clients";
import { DataTable } from "@/components/common/data-table";

export async function MonthlyClientsTable() {
  const clients = await getMonthlyClients();

  const formattedClients: MonthlyClientColumns[] = clients.map((client) => ({
    id: client.id,
    clientTypeId: client.clientType.id,
    vehicleTypeId: client.vehicleType.id,
    name: client.name!,
    email: client.email!,
    document: client.document!,
    phone: client.phone!,
    plate: client.plate,
    vehicleType: client.vehicleType.name,
    clientType: client.clientType.name,
    endDate: format(client.endDate!, "d 'de' MMMM, yyyy", { locale: es }),
    createdAt: format(client.createdAt, "d 'de' MMMM, yyyy", { locale: es }),
  }));
  return (
    <DataTable
      searchKey="plate"
      searchPlaceholder="Buscar por placa..."
      columns={columns}
      data={formattedClients}
    />
  );
}
