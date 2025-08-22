"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-actions";

export type ClientTypeColumns = {
  id: string;
  name: string;
  hasHourlyLimit: boolean;
  hourlyLimit: number | null,
  createdAt: string;
};

export const columns: ColumnDef<ClientTypeColumns>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
      const name: string = row.getValue("name");

      return (
        <p className="py-4 min-w-[120px] text-muted-foreground text-sm">
          {name}
        </p>
      );
    },
  },
  {
    accessorKey: "hasHourlyLimit",
    header: "Limite",
    cell: ({ row }) => {
      const hasHourlyLimit: boolean = row.getValue("hasHourlyLimit");

      return (
        <p className="py-4 min-w-[120px] text-muted-foreground text-sm">
          {hasHourlyLimit ? "Si" : "No"}
        </p>
      );
    },
  },
  {
    accessorKey: "hourlyLimit",
    header: "Limite de Horas",
    cell: ({ row }) => {
      const hourlyLimit: number | null = row.getValue("hourlyLimit");

      return (
        <p className="py-4 min-w-[120px] text-muted-foreground text-sm">
          {hourlyLimit ? hourlyLimit : "No"}
        </p>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Creado",
    cell: ({ row }) => {
      const createdAt: string = row.getValue("createdAt");

      return (
        <p className="py-4 min-w-[100px] text-muted-foreground text-sm">
          {createdAt}
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
