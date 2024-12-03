"use client";

import { toast } from "sonner";
import { useState, useTransition } from "react";
import { Loader, Trash2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormattedShift, FormattedWorkDay } from "@/types";
import { cn } from "@/lib/utils";
import { AlertModal } from "@/components/common/alert-modal";
import { deleteShifts } from "@/actions/shift-assigment";
import { ShiftsTable } from "@/components/common/shifts-table";

interface AssignedSchedulesProps {
  isSubmitting: boolean;
  workDays: FormattedWorkDay[];
  removedShifts: FormattedShift[];
  employeeId: string;
  employeeWorkDays: FormattedWorkDay[];
  onRemoveShift: (day: string, shiftIndex: number) => void;
  onSaveSchedule: () => void;
}

export function AssignedSchedules({
  isSubmitting,
  workDays,
  removedShifts,
  employeeId,
  employeeWorkDays,
  onRemoveShift,
  onSaveSchedule,
}: AssignedSchedulesProps) {
  const [isLoading, startTransition] = useTransition();
  const [openAlertConfirmation, setOpenAlertConfirmation] = useState(false);

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        const { error, success } = await deleteShifts(employeeId);

        if (error) {
          toast.error(error);
        }

        if (success) {
          toast.success(success);
          setOpenAlertConfirmation(false);
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
        title="¿Está seguro de eliminar todos los turnos?"
        description="Esta acción no se puede deshacer. Esto eliminará permanentemente los turnos asignados para el empleado."
        isLoading={isLoading}
        isOpen={openAlertConfirmation}
        onClose={() => setOpenAlertConfirmation(false)}
        onConfirm={handleConfirm}
      />
      <Card className="w-full max-w-2xl mx-auto dark:bg-muted/20 bg-muted-foreground/5 overflow-hidden">
        <CardHeader className="flex ss:flex-row ss:items-center justify-between gap-3">
          <CardTitle>Horarios Asignados</CardTitle>
          <Button
            variant="destructive"
            className={cn(employeeWorkDays.length === 0 && "hidden")}
            onClick={() => setOpenAlertConfirmation(true)}
          >
            <Trash2 strokeWidth={2.5} />
            Eliminar turnos
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <ShiftsTable
              workDays={workDays}
              isSubmitting={isLoading}
              isEditable
              onRemoveShift={onRemoveShift}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            disabled={
              !workDays ||
              (workDays.length === 0 && removedShifts.length === 0) ||
              isSubmitting
            }
            variant="primary"
            onClick={onSaveSchedule}
            className="w-full"
          >
            {isSubmitting && <Loader className="animate-spin" />}
            Guardar horarios
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
