"use client";

import { Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/common/modal";

interface AlertModalProps {
  title?: string;
  description?: string;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function AlertModal({
  title = "¿Estás completamente seguro?",
  description = "Después de confirmar los cambios no se podrán revertir.",
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}: AlertModalProps) {
  return (
    <Modal
      title={title}
      descripion={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex items-center justify-end gap-2">
        <Button disabled={isLoading} variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          disabled={isLoading}
          variant="destructive"
          onClick={onConfirm}
          className="dark:bg-red-500"
        >
          {isLoading && <Loader className="size-4 mr-2 animate-spin" />}
          Continuar
        </Button>
      </div>
    </Modal>
  );
}
