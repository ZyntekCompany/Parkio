"use client";

import { toast } from "sonner";
import { Trash2, Edit } from "lucide-react";
import { useState, useTransition } from "react";

import { ClientTypeColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/common/alert-modal";
import { deleteClientType } from "@/actions/business-config";
import { Modal } from "@/components/common/modal";
import { AddClientForm } from "./add-client-form";

interface CellActionProps {
  data: ClientTypeColumns;
}

export function CellAction({ data }: CellActionProps) {
  const [isLoading, startTransition] = useTransition();
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const closeDeleteDialog = () => {
    setOpenDelete(false);
  };

  const closeEditDialog = () => {
    setOpenEdit(false);
  };

  const handleConfirmDelete = () => {
    startTransition(async () => {
      try {
        const { error, success } = await deleteClientType(data.id);

        if (error) {
          toast.error("Algo salió mal.", {
            description: error,
          });
        }

        if (success) {
          toast.success("Proceso completado.", {
            description: success,
          });
          setOpenDelete(false);
        }
      } catch {
        toast.error("Error", {
          description: "Algo salió mal en el proceso.",
        });
      }
    });
  };

  return (
    <>
      {/* Modal de eliminación */}
      <AlertModal
        title="¿Está seguro de eliminar este tipo de cliente?"
        description="Esta acción no se puede deshacer. Esto eliminará permanentemente el tipo de cliente y todas sus tarifas asociadas."
        isLoading={isLoading}
        isOpen={openDelete}
        onClose={closeDeleteDialog}
        onConfirm={handleConfirmDelete}
      />

      {/* Modal de edición */}
      <Modal
        title="Editar tipo de cliente"
        description="Modifique la información del tipo de cliente."
        isOpen={openEdit}
        onClose={closeEditDialog}
      >
        <AddClientForm
          initialData={data}
          onSuccess={closeEditDialog}
        />
      </Modal>

      <div className="flex items-center gap-2">
        <Button onClick={() => setOpenEdit(true)} variant="outline" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
        <Button onClick={() => setOpenDelete(true)} variant="destructive" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
