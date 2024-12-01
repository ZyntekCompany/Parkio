"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { CellAction } from "./cell-actions";
import { cn } from "@/lib/utils";

export type MonthlyClientColumns = {
  id: string;
  clientTypeId: string;
  vehicleTypeId: string;
  monthsReserved: number;
  name: string;
  email: string;
  document: string;
  phone: string;
  plate: string;
  vehicleType: string;
  clientType: string;
  createdAt: string;
  endDate: string;
  serviceDays: number;
};

export const columns: ColumnDef<MonthlyClientColumns>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
      const name: string = row.getValue("name");

      return (
        <div className="flex items-center gap-3 min-w-[200px] py-4">
          <p className="text-muted-foreground text-sm">{name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Correo",
    cell: ({ row }) => {
      const email: string = row.getValue("email");

      return (
        <div className="flex items-center gap-3 min-w-[200px] py-4">
          <p className="text-muted-foreground text-sm">{email}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "document",
    header: () => <div className="min-w-[100px]">N° Documento</div>,
    cell: ({ row }) => {
      const document: string = row.getValue("document");

      return (
        <div className="flex items-center gap-3 min-w-[160px] py-4">
          <p className="text-muted-foreground text-sm">{document}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Teléfono",
    cell: ({ row }) => {
      const phone: string = row.getValue("phone");

      return (
        <p className="py-4 min-w-[120px] text-muted-foreground text-sm">
          {phone}
        </p>
      );
    },
  },
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
    accessorKey: "createdAt",
    header: () => <div className="min-w-[160px]">Fecha de Inicio</div>,
    cell: ({ row }) => {
      const createdAt: string = row.getValue("createdAt");

      return (
        <p className="py-4 min-w-[180px] text-muted-foreground text-sm">
          {createdAt}
        </p>
      );
    },
  },
  {
    accessorKey: "endDate",
    header: () => <div className="min-w-[160px]">Fecha de Expiración</div>,
    cell: ({ row }) => {
      const endDate: string = row.getValue("endDate");

      return (
        <p className="py-4 min-w-[180px] text-muted-foreground text-sm">
          {endDate}
        </p>
      );
    },
  },
  {
    accessorKey: "serviceDays",
    header: () => <div className="min-w-[120px]">Días de Servicio</div>,
    cell: ({ row }) => {
      const serviceDays: number = row.getValue("serviceDays");

      return (
        <div className="flex items-center gap-2 min-w-[100px] py-4">
          <Badge
            className={cn(
              "py-[6px]",
              serviceDays <= 5
                ? "bg-red-400/50 dark:bg-red-400/20 text-red-800 dark:text-red-400 border-red-400 hover:bg-red-400/25"
                : serviceDays <= 15
                ? "bg-amber-400/50 dark:bg-amber-400/20 hover:bg-amber-400/25 text-amber-800 dark:text-amber-400 border-amber-400"
                : "bg-green-400/50 dark:bg-green-400/20 text-green-800 dark:text-green-400 hover:bg-green-400/25 border-green-400"
            )}
          >
            {serviceDays > 0 ? `${serviceDays} días` : "Ya expiró"}
          </Badge>
        </div>
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
