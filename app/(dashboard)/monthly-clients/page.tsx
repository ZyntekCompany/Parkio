import { Heading } from "@/components/common/heading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CreateClientTrigger } from "./_components/create-client-trigger";
import { MonthlyClientsTable } from "./_components/monthly-clients-table";
import { TableCardSkeleton } from "@/components/skeletons/table-card-skeleton";
import { monthlyClientsColumns } from "@/constants";
import { Suspense } from "react";

export default function MonthlyClientsPage() {
  return (
    <div className="space-y-6 xs:p-4">
      <Card className="dark:bg-muted/20 bg-muted-foreground/5">
        <CardHeader className="px-4 sm:p-6">
          <div className="flex md-plus:flex-row flex-col justify-between md-plus:items-center gap-3">
            <Heading
              title="Clientes Mensuales"
              description="Crea y gestiona de forma fácil tus clientes mensuales."
            />
            <CreateClientTrigger />
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:p-6">
          <Suspense
            fallback={<TableCardSkeleton inputPlaceholder="Buscar por placa..." columns={monthlyClientsColumns} />}
          >
            <MonthlyClientsTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
