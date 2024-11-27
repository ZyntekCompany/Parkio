"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { AddFeeForm } from "./add-fee-form";
import { getClientTypes, getVehicleTypes } from "@/actions/business-config";
import { VehicleType } from "@prisma/client";

export function AddFeeTrigger() {
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
      <Modal title="Agregar nueva tarifa" isOpen={open} onClose={closeDialog}>
        <AddFeeForm vehicleTypes={vehicleTypes} clientTypes={clientTypes} closeDialog={closeDialog} />
      </Modal>
      <Button variant="primary" onClick={() => setOpen(true)}>
        <Plus />
        Nuevo
      </Button>
    </>
  );
}
