import { format } from "date-fns";
import { es } from "date-fns/locale";

import { getClientTypes } from "@/actions/business-config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { columns, ClientTypeColumns } from "./columns";
import { DataTable } from "@/components/common/data-table";
import { AddClientTrigger } from "./add-client-trigger";

export async function ClientTypeConfig() {
  const clientTypes = await getClientTypes();

  const formattedVehicleTypes: ClientTypeColumns[] = clientTypes.map(
    (clientType) => ({
      id: clientType.id,
      name: clientType.name,
      createdAt: format(clientType.createdAt, "dd/MM, yyyy", { locale: es }),
    })
  );

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
