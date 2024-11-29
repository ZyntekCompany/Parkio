import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AddFeeTrigger } from "./add-fee-trigger";
import { Suspense } from "react";
import { FeeConfigTable } from "./fee-config-table";
import { TableCardSkeleton } from "@/components/skeletons/table-card-skeleton";
import { feeConfigColumns } from "@/constants";

export function FeeConfig() {
  return (
    <Card className="max-xs:p-0 border-none dark:bg-muted/20 bg-muted-foreground/5 space-y-0">
      <CardHeader className="flex md:flex-row justify-between md:items-center gap-3 max-sm:px-4">
        <div className="space-y-1">
          <CardTitle>Tarifas</CardTitle>
          <CardDescription>
            Agregue, edite o elimine las tarifas.
          </CardDescription>
        </div>
        <AddFeeTrigger />
      </CardHeader>
      <CardContent className="max-sm:px-4">
        <Suspense
          fallback={
            <TableCardSkeleton
              columns={feeConfigColumns}
              inputPlaceholder="Buscar por vehículo..."
            />
          }
        >
          <FeeConfigTable />
        </Suspense>
      </CardContent>
    </Card>
  );
}
