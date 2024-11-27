import { getClientTypes, getFees } from "@/actions/business-config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { columns, FeeColumns } from "./columns";
import { DataTable } from "@/components/common/data-table";
import { AddFeeTrigger } from "./add-fee-trigger";

export async function FeeConfig() {
  const fees = await getFees();
  const clientTypes = await getClientTypes();

  const formattedClientTypes = clientTypes.map((clientType) => clientType.name);
  const filters = [...formattedClientTypes, "Todos"];

  const formattedFees: FeeColumns[] = fees.map((fee) => ({
    monthlyFeeId: fee.monthlyFeeId!,
    hourlyFeeId: fee.hourlyFeeId!,
    vehicleTypeId: fee.vehicleTypeId,
    clientTypeId: fee.clientTypeId,
    vehicleType: fee.vehicleType,
    clientType: fee.clientType,
    hourlyFee: fee.hourlyFee!,
    monthlyFee: fee.monthlyFee!,
  }));

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
        <DataTable
          searchKey="vehicleType"
          searchPlaceholder="Filtra por vehículo..."
          columns={columns}
          data={formattedFees}
          showFilterSelect
          filterColumnName="clientType"
          filterDefault="Todos"
          filters={filters}
        />
      </CardContent>
    </Card>
  );
}
