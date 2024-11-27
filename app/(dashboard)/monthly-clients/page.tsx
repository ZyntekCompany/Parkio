import { format } from "date-fns";
import { es } from "date-fns/locale";

import { DataTable } from "@/components/common/data-table";
import { Heading } from "@/components/common/heading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CreateClientTrigger } from "./_components/create-client-trigger";
import { columns, MonthlyClientColumns } from "./_components/columns";
import { getMonthlyClients } from "@/actions/monthly-clients";

export default async function MonthlyClientsPage() {
  const clients = await getMonthlyClients();

  const formattedClients: MonthlyClientColumns[] = clients.map((client) => ({
    id: client.id,
    clientTypeId: client.clientType.id,
    vehicleTypeId: client.vehicleType.id,
    name: client.name!,
    email: client.email!,
    document: client.document!,
    phone: client.phone!,
    plate: client.plate,
    vehicleType: client.vehicleType.name,
    clientType: client.clientType.name,
    endDate: format(client.endDate!, "d 'de' MMMM, yyyy", { locale: es }),
    createdAt: format(client.createdAt, "d 'de' MMMM, yyyy", { locale: es }),
  }));

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
          <DataTable
            searchKey="plate"
            searchPlaceholder="Buscar por placa..."
            columns={columns}
            data={formattedClients}
          />
        </CardContent>
      </Card>
    </div>
  );
}
