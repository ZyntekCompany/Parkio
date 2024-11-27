"use client";

import { toast } from "sonner";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import { FeeColumns } from "./columns";
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
import {
  deleteFees,
  getClientTypes,
  getVehicleTypes,
} from "@/actions/business-config";
import { ClientType, VehicleType } from "@prisma/client";
import { AddFeeForm } from "./add-fee-form";

interface CellActionProps {
  data: FeeColumns;
}

export function CellAction({ data }: CellActionProps) {
  const [isLoading, startTransition] = useTransition();

  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [clientTypes, setClientTypes] = useState<ClientType[]>([]);

  const [open, setOpen] = useState(false);
  const [openAlertConfirmation, setOpenAlertConfirmation] = useState(false);

  useEffect(() => {
    getVehicleTypes().then((result) => setVehicleTypes(result));
    getClientTypes().then((result) => setClientTypes(result));
  }, []);

  const closeDialog = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        const { error, success } = await deleteFees(data);

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
          description: "Algo salió mal al eliminar las tarifas.",
        });
      }
    });
  };

  return (
    <>
      <AlertModal
        title="¿Está seguro de eliminar este tipo de cliente?"
        description="Esta acción no se puede deshacer. Esto eliminará permanentemente el tipo de cliente y todas sus tarifas asociadas."
        isLoading={isLoading}
        isOpen={openAlertConfirmation}
        onClose={() => setOpenAlertConfirmation(false)}
        onConfirm={handleConfirm}
      />

      <Modal title="Editar tarifas" isOpen={open} onClose={closeDialog}>
        <AddFeeForm
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
