"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, CreditCard, Loader } from "lucide-react";
import React, { useEffect, useState, useTransition } from "react";
import { HourlyClientColumns } from "./columns";
import { calculateTotalFee, getPaidDetails } from "@/actions/hourly-clients";
import { formatToCOP } from "@/utils/format-to-cop";
import { toast } from "sonner";

interface PaidDetailsTriggerProps {
  data: HourlyClientColumns;
}

export default function PaidDetailsTrigger({ data }: PaidDetailsTriggerProps) {
  const [isLoading, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [paidDetails, setPaidDetails] = useState<{
    stayDuration: string;
    totalAmount: number;
  }>();

  useEffect(() => {
    getPaidDetails(data).then((result) => setPaidDetails(result));
  }, [isOpen, data]);

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        const { error, success } = await calculateTotalFee(data);

        if (error) {
          toast.error("Algo salió mal.", {
            description: error,
          });
        }

        if (success) {
          toast.success("Proceso completado.", {
            description: success,
          });
          setIsOpen(false);
        }
      } catch (error) {
        toast.error("Error", {
          description: "Algo salió mal en el proceso.",
        });
      }
    });
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-emerald-400/50 dark:bg-emerald-400/20 hover:bg-emerald-400/60 text-emerald-800 dark:text-emerald-400 border-emerald-400/50 border ease-in-out shadow-md hover:shadow-lg"
      >
        <CreditCard className="mr-2 h-4 w-4" />
        Detalles de Pago
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detalles de Pago</DialogTitle>
            <DialogDescription>
              Resumen de estancia en el parqueadero.
            </DialogDescription>
          </DialogHeader>
          {!paidDetails && (
            <div className="flex items-center justify-center py-3">
              <Loader className="size-5 animate-spin shrink-0" />
            </div>
          )}
          {paidDetails && (
            <div className="grid gap-4 py-4">
              <div className="text-center">
                <div className="text-4xl font-bold tracking-tighter">
                  {`${formatToCOP(paidDetails?.totalAmount!)} COP`}
                </div>
              </div>
              <div className="space-y-3 bg-muted-foreground/10 rounded-lg p-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="">Vehículo:</span>
                  <span>{data.plate}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2">Tiempo:</span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />{" "}
                    {paidDetails.stayDuration}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="justify-end">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={isLoading || paidDetails?.totalAmount === 0}
              variant="primary"
              onClick={handleConfirm}
            >
              {isLoading && <Loader className="mr-2 size-4 animate-spin" />}
              Confirmar Pago
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
