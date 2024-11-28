"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import UserAvatar from "@/components/common/user-avatar";
import { UserRole } from "@prisma/client";
import { CellAction } from "./cell-actions";

export type UserColumns = {
  id: string;
  image: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
};

export const columns: ColumnDef<UserColumns>[] = [
  {
    accessorKey: "image",
    header: "Imagen",
    cell: ({ row }) => {
      const image: string = row.getValue("image");
      const name: string = row.getValue("name");

      return (
        <div className="flex items-center gap-3 py-4 ">
          <UserAvatar userName={name} src={image} />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
      const name: string = row.getValue("name");

      return (
        <div className="flex items-center gap-3 min-w-[200px] py-4 ">
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
        <div className="flex items-center gap-3 min-w-[200px] py-4 ">
          <p className="text-muted-foreground text-sm">{email}</p>
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
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => {
      const role: UserRole = row.getValue("role");

      return (
        <Badge
          variant={
            role === "SuperAdmin"
              ? "primary"
              : role === "Admin"
              ? "secondary"
              : "tertiary"
          }
        >
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="min-w-[120px]">Fecha de inicio</div>,
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
    id: "actions",
    cell: ({ row }) => (
      <div className="text-end min-w-[80px]">
        <CellAction data={row.original} />
      </div>
    ),
  },
];
