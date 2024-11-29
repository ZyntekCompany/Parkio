import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddClientTrigger } from "./add-client-trigger";
import { ClientTypeTable } from "./client-type-table";
import { Suspense } from "react";
import { TableCardSkeleton } from "@/components/skeletons/table-card-skeleton";
import { vehicleAndClientsTypeColumns } from "@/constants";

export function ClientTypeConfig() {
  return (
    <Card className="max-xs:p-0 dark:bg-muted/20 bg-muted-foreground/5 space-y-0">
      <CardHeader className="flex md:flex-row justify-between md:items-center gap-3 max-sm:px-4">
        <div className="space-y-1">
          <CardTitle>Tipos de Clientes</CardTitle>
          <CardDescription>
            Agregue, edite o elimine tipos de clientes.
          </CardDescription>
        </div>
        <AddClientTrigger />
      </CardHeader>
      <CardContent className="max-sm:px-4">
        <Suspense
          fallback={
            <TableCardSkeleton
              columns={vehicleAndClientsTypeColumns}
              rowCount={2}
              inputPlaceholder="Buscar por nombre..."
            />
          }
        >
          <ClientTypeTable />
        </Suspense>
      </CardContent>
    </Card>
  );
}
