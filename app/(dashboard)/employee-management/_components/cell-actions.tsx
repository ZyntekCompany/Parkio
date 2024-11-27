"use client";

import { toast } from "sonner";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

import { UserColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/common/alert-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Modal } from "@/components/common/modal";
import { UpdateUserForm } from "./update-user-form";
import { deleteUser } from "@/actions/employee-management";

interface CellActionProps {
  data: UserColumns;
}

export function CellAction({ data }: CellActionProps) {
  const [isLoading, startTransition] = useTransition();

  const [open, setOpen] = useState(false);
  const [openAlertConfirmation, setOpenAlertConfirmation] = useState(false);

  const closeDialog = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        const { error, success } = await deleteUser(data);

        if (error) {
          toast.error("Algo salió mal.", {
            description: error,
          });
        }

        if (success) {
          toast.success("Proceso completado.", {
            description: success,
          });
          setOpenAlertConfirmation(false);
        }
      } catch {
        toast.error("Error", {
          description: "Algo salió mal al eliminar al usuario.",
        });
      }
    });
  };

  return (
    <>
      <AlertModal
        title="¿Está seguro de eliminar al empleado?"
        description="Esta acción no se puede deshacer. Esto eliminará permanentemente al empleado de la plataforma."
        isLoading={isLoading}
        isOpen={openAlertConfirmation}
        onClose={() => setOpenAlertConfirmation(false)}
        onConfirm={handleConfirm}
      />

      <Modal
        title="Editar datos del empleado"
        isOpen={open}
        onClose={closeDialog}
        className="max-h-[500px] h-full"
      >
        <UpdateUserForm initialData={data} closeDialog={closeDialog} />
      </Modal>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Edit className="size-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenAlertConfirmation(true)}
            className=" dark:hover:focus:bg-rose-400/20 hover:focus:bg-rose-400/20 text-rose-400 hover:focus:text-rose-400 dark:hover:focus:text-rose-400"
          >
            <Trash2 className="size-4 mr-2" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
