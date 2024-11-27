"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-actions";

export type ClientTypeColumns = {
  id: string;
  name: string;
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
