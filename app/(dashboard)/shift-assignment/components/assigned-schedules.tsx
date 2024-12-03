"use client";

import { toast } from "sonner";
import { useState, useTransition } from "react";
import { Loader, Trash2, X } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatTimeTo12Hour } from "@/utils/format-time-to-twelve-hour";
import { Button } from "@/components/ui/button";
import { FormattedShift, FormattedWorkDay } from "@/types";
import { daysOfWeek } from "@/constants";
import { cn } from "@/lib/utils";
import { AlertModal } from "@/components/common/alert-modal";
import { deleteShifts } from "@/actions/shift-assigment";

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
            <Table className="min-w-[550px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Día</TableHead>
                  <TableHead>Turnos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workDays
                  .sort(
                    (a, b) =>
                      daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day) // Ordena según el índice
                  )
                  .map((schedule, index) => (
                    <TableRow key={index}>
                      <TableCell>{schedule.day}</TableCell>
                      <TableCell>
                        {schedule.shifts.map((shift, index) => (
                          <Badge
                            key={index}
                            className="group mr-2 mb-2 bg-muted-foreground/20 hover:bg-muted-foreground/50 p-2 text-foreground"
                          >
                            <div>
                              {formatTimeTo12Hour(shift.startTime)} -{" "}
                              {formatTimeTo12Hour(shift.endTime)}
                            </div>
                            <Button
                              disabled={isSubmitting}
                              variant="ghost"
                              className={cn(
                                "size-4 rounded-full p-2.5 hover:bg-rose-200 hover:text-rose-500 ml-2",
                                isSubmitting && "hidden"
                              )}
                              onClick={() => onRemoveShift(schedule.day, index)}
                            >
                              <X strokeWidth={2.5} className="shrink-0" />
                            </Button>
                          </Badge>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                {workDays.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center">
                      Sin turnos asignados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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
