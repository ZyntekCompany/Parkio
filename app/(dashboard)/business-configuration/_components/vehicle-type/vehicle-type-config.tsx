import { format } from "date-fns";
import { es } from "date-fns/locale";

import { getVehicleTypes } from "@/actions/business-config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { columns, VehicleTypeColumns } from "./columns";
import { DataTable } from "@/components/common/data-table";
import { AddVehicleTrigger } from "./add-vehicle-trigger";

export async function VehicleTypeConfig() {
  const vehicleTypes = await getVehicleTypes();

  const formattedVehicleTypes: VehicleTypeColumns[] = vehicleTypes.map(
    (vehicleType) => ({
      id: vehicleType.id,
      name: vehicleType.name,
      createdAt: format(vehicleType.createdAt, "dd/MM, yyyy", { locale: es }),
    })
  );

  return (
    <Card className="max-xs:p-0 dark:bg-muted/20 bg-muted-foreground/5 space-y-0">
      <CardHeader className="flex md:flex-row justify-between md:items-center gap-3 max-sm:px-4">
        <div className="space-y-1">
          <CardTitle>Tipos de Vehículos</CardTitle>
          <CardDescription>
            Agregue, edite o elimine tipos de vehículos.
          </CardDescription>
        </div>
        <AddVehicleTrigger />
      </CardHeader>
      <CardContent className="max-sm:px-4">
        <DataTable
          searchKey="name"
          searchPlaceholder="Filtra por nombre..."
          columns={columns}
          data={formattedVehicleTypes}
        />
      </CardContent>
    </Card>
  );
}
