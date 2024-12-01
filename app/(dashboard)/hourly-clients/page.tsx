import { Heading } from "@/components/common/heading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CreateClientTrigger } from "./_components/create-client-trigger";
import { Suspense } from "react";
import { HourlyClientsTable } from "./_components/hourly-clients-table";
import { TableCardSkeleton } from "@/components/skeletons/table-card-skeleton";
import { hourlyClientsColumns } from "@/constants";

export default function HourlyClientsPage() {
  return (
    <div className="space-y-6 xs:p-4">
      <Card className="dark:bg-muted/20 bg-muted-foreground/5">
        <CardHeader className="px-4 sm:p-6">
          <div className="flex md-plus:flex-row flex-col justify-between md-plus:items-center gap-3">
            <Heading
              title="Clientes Por Hora"
              description="Crea y gestiona de forma fácil tus clientes por hora."
            />
            <CreateClientTrigger />
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:p-6">
          <Suspense
            fallback={
              <TableCardSkeleton
                inputPlaceholder="Buscar por placa..."
                columns={hourlyClientsColumns}
              />
            }
          >
            <HourlyClientsTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
