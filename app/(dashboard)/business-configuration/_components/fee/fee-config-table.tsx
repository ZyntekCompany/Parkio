import { getClientTypes, getFees } from "@/actions/business-config";
import { columns, FeeColumns } from "./columns";
import { DataTable } from "@/components/common/data-table";

export async function FeeConfigTable() {
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
    <DataTable
      searchKey="vehicleType"
      searchPlaceholder="Buscar por vehículo..."
      columns={columns}
      data={formattedFees}
      showFilterSelect
      filterColumnName="clientType"
      filterDefault="Todos"
      filters={filters}
    />
  );
}
