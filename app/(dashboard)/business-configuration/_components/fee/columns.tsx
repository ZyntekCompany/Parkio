"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-actions";
import { Badge } from "@/components/ui/badge";
import { formatToCOP } from "@/utils/format-to-cop";

export type FeeColumns = {
  vehicleTypeId: string;
  clientTypeId: string;
  vehicleType: string;
  clientType: string;
  hourlyFee: number;
  hourlyFeeId: string;
  monthlyFee: number;
  monthlyFeeId: string;
};

export const columns: ColumnDef<FeeColumns>[] = [
  {
    accessorKey: "vehicleType",
    header: () => <div className="min-w-[120px]">Tipo de vehículo</div>,
    cell: ({ row }) => {
      const vehicleType: string = row.getValue("vehicleType");

      return (
        <p className="py-4 min-w-[120px] text-muted-foreground text-sm">
          {vehicleType}
        </p>
      );
    },
  },
  {
    accessorKey: "clientType",
    header: () => <div className="min-w-[120px]">Tipo de cliente</div>,
    cell: ({ row }) => {
      const clientType: string = row.getValue("clientType");

      return (
        <div className="min-w-[120px]">
          <Badge>{clientType}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "hourlyFee",
    header: () => <div className="min-w-[120px]">Tarifa por hora</div>,
    cell: ({ row }) => {
      const hourlyFee: number = row.getValue("hourlyFee");

      return (
        <p className="py-4 min-w-[120px] text-muted-foreground text-sm">
          {`${formatToCOP(hourlyFee)}`}
        </p>
      );
    },
  },
  {
    accessorKey: "monthlyFee",
    header: () => <div className="min-w-[120px]">Tarifa por mes</div>,
    cell: ({ row }) => {
      const monthlyFee: number = row.getValue("monthlyFee");

      return (
        <p className="py-4 min-w-[120px] text-muted-foreground text-sm">
          {`${formatToCOP(monthlyFee)}`}
        </p>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="text-end min-w-[80px]">
        <CellAction data={row.original} />
      </div>
    ),
  },
];
