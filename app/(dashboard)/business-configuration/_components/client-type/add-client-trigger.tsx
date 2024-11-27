"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { AddClientForm } from "./add-client-form";

export function AddClientTrigger() {
  const [open, setOpen] = useState(false);

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal title="Nuevo tipo de cliente" isOpen={open} onClose={closeDialog}>
        <AddClientForm closeDialog={closeDialog} />
      </Modal>
      <Button variant="primary" onClick={() => setOpen(true)}>
        <Plus />
        Nuevo
      </Button>
    </>
  );
}
