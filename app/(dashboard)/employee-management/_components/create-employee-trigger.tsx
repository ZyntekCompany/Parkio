"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { RegisterForm } from "./register-form";

export function CreateEmployeeTrigger() {
  const [open, setOpen] = useState(false);

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        title="Crear nuevo empleado"
        descripion="Registra nuevos empleados y otorga acceso al sistema."
        isOpen={open}
        onClose={closeDialog}
        className="max-h-[500px] h-full"
      >
        <RegisterForm buttonLabel="Crear usuario" />
      </Modal>
      <Button variant="primary" onClick={() => setOpen(true)}>
        <Plus />
        Nuevo empleado
      </Button>
    </>
  );
}
