"use client";

import { toast } from "sonner";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import { MonthlyClientColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/common/alert-modal";
import { Modal } from "@/components/common/modal";
import { deleteMonthlyClient } from "@/actions/monthly-clients";
import { useCurrentRole } from "@/hooks/use-current-role";
import { cn } from "@/lib/utils";
import { ClientType, UserRole, VehicleType } from "@prisma/client";
import { MonthlyClientForm } from "./monthly-client-form";
import { getClientTypes, getVehicleTypes } from "@/actions/business-config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CellActionProps {
  data: MonthlyClientColumns;
}

export function CellAction({ data }: CellActionProps) {
  const loggedRole = useCurrentRole();

  const [isLoading, startTransition] = useTransition();

  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [clientTypes, setClientTypes] = useState<ClientType[]>([]);
  const [role, setRole] = useState<UserRole>("Empleado");
  const [open, setOpen] = useState(false);
  const [openAlertConfirmation, setOpenAlertConfirmation] = useState(false);

  const closeDialog = () => {
    setOpen(false);
  };

  useEffect(() => {
    setRole(loggedRole!);
    getVehicleTypes().then((result) => setVehicleTypes(result));
    getClientTypes().then((result) => setClientTypes(result));
  }, [loggedRole]);

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        const { error, success } = await deleteMonthlyClient(data.id);

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
        title="¿Está seguro de eliminar a este cliente?"
        description="Esta acción no se puede deshacer. Esto eliminará permanentemente al cliente de la plataforma."
        isLoading={isLoading}
        isOpen={openAlertConfirmation}
        onClose={() => setOpenAlertConfirmation(false)}
        onConfirm={handleConfirm}
      />

      <Modal
        title="Corregir datos del cliente"
        isOpen={open}
        onClose={closeDialog}
        className="max-h-[500px] h-full"
      >
        <MonthlyClientForm
          initialData={data}
          vehicleTypes={vehicleTypes}
          clientTypes={clientTypes}
          closeDialog={closeDialog}
        />
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
            className={cn(
              "dark:hover:focus:bg-rose-400/20 hover:focus:bg-rose-400/20 text-rose-400 hover:focus:text-rose-400 dark:hover:focus:text-rose-400",
              role !== "SuperAdmin" && role !== "Admin" && "hidden"
            )}
          >
            <Trash2 className="size-4 mr-2" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
