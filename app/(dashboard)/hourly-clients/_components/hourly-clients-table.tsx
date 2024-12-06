import { format } from "date-fns";
import { es } from "date-fns/locale";

import { getHourlyClients } from "@/actions/hourly-clients";
import { columns, HourlyClientColumns } from "./columns";
import { DataTable } from "@/components/common/data-table";

export async function HourlyClientsTable() {
  const clients = await getHourlyClients();

  const formattedClients: HourlyClientColumns[] = clients.map((client) => ({
    id: client.id,
    clientTypeId: client.clientType.id,
    vehicleTypeId: client.vehicleType.id,
    plate: client.plate,
    vehicleType: client.vehicleType.name,
    clientType: client.clientType.name,
    entryDate: format(client.entryDate!, "d  MMMM yyyy,  h:mm a", {
      locale: es,
    }),
  }));

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
