import { format } from "date-fns";
import { es } from "date-fns/locale";

import { getVehicleTypes } from "@/actions/business-config";
import { columns, VehicleTypeColumns } from "./columns";
import { DataTable } from "@/components/common/data-table";

export async function VehicleTypeTable() {
  const vehicleTypes = await getVehicleTypes();

  const formattedVehicleTypes: VehicleTypeColumns[] = vehicleTypes.map(
    (vehicleType) => ({
      id: vehicleType.id,
      name: vehicleType.name,
      createdAt: format(vehicleType.createdAt, "dd/MM, yyyy", { locale: es }),
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
