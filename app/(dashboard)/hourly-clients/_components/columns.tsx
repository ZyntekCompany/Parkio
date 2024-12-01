"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { CellAction } from "./cell-actions";
import PaidDetailsTrigger from "./paid-details-trigger";

export type HourlyClientColumns = {
  id: string;
  clientTypeId: string;
  vehicleTypeId: string;
  plate: string;
  vehicleType: string;
  clientType: string;
  entryDate: string;
};

export const columns: ColumnDef<HourlyClientColumns>[] = [
  {
    accessorKey: "plate",
    header: "Placa",
    cell: ({ row }) => {
      const plate: string = row.getValue("plate");

      return (
        <div className="flex items-center gap-3 min-w-[160px] py-4">
          <Badge className="bg-yellow-400 hover:bg-yellow-500 text-zinc-900">{plate}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "vehicleType",
    header: () => <div className="min-w-[120px]">Tipo de Vehículo</div>,
    cell: ({ row }) => {
      const vehicleType: string = row.getValue("vehicleType");

      return (
        <div className="flex items-center gap-3 min-w-[160px] py-4">
          <Badge>{vehicleType}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "clientType",
    header: () => <div className="min-w-[120px]">Tipo de Cliente</div>,
    cell: ({ row }) => {
      const clientType: string = row.getValue("clientType");

      return (
        <div className="flex items-center gap-3 min-w-[160px] py-4">
          <Badge>{clientType}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "entryDate",
    header: () => <div className="min-w-[160px]">Fecha de entrada</div>,
    cell: ({ row }) => {
      const entryDate: string = row.getValue("entryDate");

      return (
        <p className="py-4 min-w-[180px] text-muted-foreground text-sm">
          {entryDate}
        </p>
      );
    },
  },
  {
    id: "details",
    header: () => <div className="min-w-[160px]">Detalles de Pago</div>,
    cell: ({ row }) => (
      <div className="min-w-[80px]">
        <PaidDetailsTrigger data={row.original} />
      </div>
    ),
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
