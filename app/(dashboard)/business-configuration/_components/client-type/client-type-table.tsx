import { format } from "date-fns";
import { es } from "date-fns/locale";

import { getClientTypes } from "@/actions/business-config";
import { columns, ClientTypeColumns } from "./columns";
import { DataTable } from "@/components/common/data-table";

export async function ClientTypeTable() {
  const clientTypes = await getClientTypes();

  const formattedVehicleTypes: ClientTypeColumns[] = clientTypes.map(
    (clientType) => ({
      id: clientType.id,
      name: clientType.name,
      createdAt: format(clientType.createdAt, "dd/MM, yyyy", { locale: es }),
    })
  );

  return (
    <DataTable
      searchKey="name"
      searchPlaceholder="Buscar por nombre..."
      columns={columns}
      data={formattedVehicleTypes}
    />
  );
}
