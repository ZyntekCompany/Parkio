"use client";

import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

import { ClientTypeColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/common/alert-modal";
import { deleteClientType } from "@/actions/business-config";

interface CellActionProps {
  data: ClientTypeColumns;
}

export function CellAction({ data }: CellActionProps) {
  const [isLoading, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const closeDialog = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
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
          setOpen(false);
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
      <AlertModal
        title="¿Está seguro de eliminar este tipo de cliente?"
        description="Esta acción no se puede deshacer. Esto eliminará permanentemente el tipo de cliente y todas sus tarifas asociadas."
        isLoading={isLoading}
        isOpen={open}
        onClose={closeDialog}
        onConfirm={handleConfirm}
      />

      <Button onClick={() => setOpen(true)} variant="destructive" size="icon">
        <Trash2 />
      </Button>
    </>
  );
}
