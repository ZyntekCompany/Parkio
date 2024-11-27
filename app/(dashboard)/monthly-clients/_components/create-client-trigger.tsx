"use client";

import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { MonthlyClientRegistrationForm } from "./monthly-client-form";
import { getClientTypes, getVehicleTypes } from "@/actions/business-config";

export function CreateClientTrigger() {
  const [open, setOpen] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState<
    {
      id: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
    }[]
  >([]);
  const [clientTypes, setClientTypes] = useState<
    {
      id: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
    }[]
  >([]);

  const closeDialog = () => {
    setOpen(false);
  };

  useEffect(() => {
    getVehicleTypes().then((result) => setVehicleTypes(result));
    getClientTypes().then((result) => setClientTypes(result));
  }, []);

  return (
    <>
      <Modal
        title="Crear cliente"
        isOpen={open}
        onClose={closeDialog}
        className="max-h-[500px] h-full"
      >
        <MonthlyClientRegistrationForm
          vehicleTypes={vehicleTypes}
          clientTypes={clientTypes}
          closeDialog={closeDialog}
        />
      </Modal>
      <Button variant="primary" onClick={() => setOpen(true)}>
        <Plus />
        Nuevo Cliente
      </Button>
    </>
  );
}
