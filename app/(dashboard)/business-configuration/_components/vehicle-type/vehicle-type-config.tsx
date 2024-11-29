import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AddVehicleTrigger } from "./add-vehicle-trigger";
import { Suspense } from "react";
import { VehicleTypeTable } from "./vehicle-type-table";
import { TableCardSkeleton } from "@/components/skeletons/table-card-skeleton";
import { vehicleAndClientsTypeColumns } from "@/constants";

export function VehicleTypeConfig() {
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
        <Suspense
          fallback={
            <TableCardSkeleton
              rowCount={2}
              inputPlaceholder="Buscar por nombre..."
              columns={vehicleAndClientsTypeColumns}
            />
          }
        >
          <VehicleTypeTable />
        </Suspense>
      </CardContent>
    </Card>
  );
}
