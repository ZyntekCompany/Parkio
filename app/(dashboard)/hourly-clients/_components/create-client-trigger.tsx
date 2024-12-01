"use client";

import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Clock, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { HourlyClientForm } from "./hourly-client-form";
import { getClientTypes, getVehicleTypes } from "@/actions/business-config";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface CreateClientTriggerProps {
  isGlobal?: boolean;
}

export function CreateClientTrigger({ isGlobal }: CreateClientTriggerProps) {
  const pathname = usePathname();

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
        className={cn(
          "h-fit max-h-fit",
          clientTypes.length > 1 &&
            (vehicleTypes.length > 1 && "max-h-[500px] h-full")
        )}
      >
        <HourlyClientForm
          vehicleTypes={vehicleTypes}
          clientTypes={clientTypes}
          closeDialog={closeDialog}
        />
      </Modal>
      {!isGlobal && (
        <Button variant="primary" onClick={() => setOpen(true)}>
          <Plus />
          Nuevo cliente
        </Button>
      )}
      {isGlobal && (
        <Button
          variant="primary"
          className={cn(
            "rounded-full size-9 p-0",
            pathname === "/hourly-clients" && "hidden"
          )}
          onClick={() => setOpen(true)}
        >
          <Clock className=" shrink-0" />
        </Button>
      )}
    </>
  );
}
