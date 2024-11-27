"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { AddVehicleForm } from "./add-vehicle-form";

export function AddVehicleTrigger() {
  const [open, setOpen] = useState(false);

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal title="Nuevo tipo de vehiculo" isOpen={open} onClose={closeDialog}>
        <AddVehicleForm closeDialog={closeDialog} />
      </Modal>
      <Button variant="primary" onClick={() => setOpen(true)}>
        <Plus />
        Nuevo
      </Button>
    </>
  );
}
