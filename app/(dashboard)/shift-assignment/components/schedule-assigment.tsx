"use client";

import { toast } from "sonner";
import { useEffect, useState, useTransition } from "react";

import {
  EmployeeExtendedWithWorkDays,
  FormattedShift,
  FormattedWorkDay,
} from "@/types";
import { createShifts } from "@/actions/shift-assigment";
import { AssignedSchedules } from "./assigned-schedules";
import { ShiftForm } from "./shift-form";
import { sortShiftsByStartTime } from "@/utils/sort-shifts-by-start-time";

interface ScheduleAssignmentProps {
  employee: EmployeeExtendedWithWorkDays;
  employeeWorkDays: FormattedWorkDay[];
}

export default function ScheduleAssignment({
  employee,
  employeeWorkDays,
}: ScheduleAssignmentProps) {
  const [workDays, setWorkDays] =
    useState<FormattedWorkDay[]>(employeeWorkDays);
  const [currentDay, setCurrentDay] = useState<string>("");
  const [currentShift, setCurrentShift] = useState<FormattedShift>({
    startTime: "",
    endTime: "",
  });
  const [removedShifts, setRemovedShifts] = useState<FormattedShift[]>([]);
  const [isLoading, startTransition] = useTransition();

  useEffect(() => {
    setCurrentDay("");
    setRemovedShifts([]);
    setWorkDays(employeeWorkDays);
    setCurrentShift({
      startTime: "",
      endTime: "",
    });
  }, [employee, employeeWorkDays]);

  const handleDayChange = (day: string) => {
    setCurrentDay(day);
  };

  const handleShiftChange = (field: "startTime" | "endTime", value: string) => {
    setCurrentShift({ ...currentShift, [field]: value });
  };

  const addShift = () => {
    // Verificar si se han proporcionado todos los valores necesarios
    if (currentDay && currentShift.startTime && currentShift.endTime) {
      // Validar si la hora de inicio es mayor que la de fin
      const shiftStart = new Date(`1970-01-01T${currentShift.startTime}`);
      const shiftEnd = new Date(`1970-01-01T${currentShift.endTime}`);

      // Si la hora de inicio es mayor o igual que la hora de fin, mostramos un mensaje y salimos de la función
      if (shiftStart >= shiftEnd) {
        toast.error(
          "La hora de inicio no puede ser mayor o igual a la hora de fin."
        );
        return; // Detenemos la ejecución
      }

      const dayIndex = workDays.findIndex((wd) => wd.day === currentDay);

      if (dayIndex !== -1) {
        // Obtener los turnos existentes para el día seleccionado
        const existingShifts = workDays[dayIndex].shifts;

        // Verificar si el nuevo turno se solapa con alguno existente
        const hasOverlap = existingShifts.some((shift) =>
          isOverlapping(shift, currentShift)
        );

        if (hasOverlap) {
          toast.error("El turno se superpone con otro ya existente.");
          return workDays; // No hacemos cambios en el estado si hay un solapamiento
        }
      }

      // Si las horas son correctas, procedemos a añadir el turno
      setWorkDays((prevWorkDays) => {
        const dayIndex = prevWorkDays.findIndex((wd) => wd.day === currentDay);

        if (dayIndex !== -1) {
          // Obtener los turnos existentes para el día seleccionado
          const existingShifts = prevWorkDays[dayIndex].shifts;

          // Crear una copia del día con los turnos actualizados
          const updatedWorkDays = [...prevWorkDays];
          const updatedDay = {
            ...updatedWorkDays[dayIndex],
            shifts: sortShiftsByStartTime([...existingShifts, currentShift]),
          };
          updatedWorkDays[dayIndex] = updatedDay;

          return updatedWorkDays;
        } else {
          // Si el día no existe, creamos uno nuevo
          return [...prevWorkDays, { day: currentDay, shifts: [currentShift] }];
        }
      });

      // Resetear el turno actual
      setCurrentShift({ startTime: "", endTime: "" });
    } else {
      toast.error("Información incompleta para añadir el turno");
    }
  };

  const isOverlapping = (
    shift1: { startTime: string; endTime: string },
    shift2: { startTime: string; endTime: string }
  ) => {
    const shift1Start = new Date(`1970-01-01T${shift1.startTime}`);
    const shift1End = new Date(`1970-01-01T${shift1.endTime}`);

    const shift2Start = new Date(`1970-01-01T${shift2.startTime}`);
    const shift2End = new Date(`1970-01-01T${shift2.endTime}`);

    // Verificar si los intervalos de tiempo se solapan
    return shift1Start < shift2End && shift2Start < shift1End;
  };

  const removeShift = (day: string, shiftIndex: number) => {
    setWorkDays((prevWorkDays) => {
      return prevWorkDays
        .map((wd) => {
          if (wd.day === day) {
            const removedShift = wd.shifts[shiftIndex];

            setRemovedShifts((currentRemovedShifts) => {
              if (
                !currentRemovedShifts.includes(removedShift) &&
                removedShift.id
              ) {
                return [...currentRemovedShifts, removedShift];
              }
              return currentRemovedShifts;
            });

            return {
              ...wd,
              shifts: wd.shifts.filter((_, index) => index !== shiftIndex),
            };
          }
          return wd;
        })
        .filter((wd) => wd.shifts.length > 0); // Eliminar días sin turnos
    });
  };

  const saveSchedule = () => {
    startTransition(async () => {
      try {
        const { error, success } = await createShifts(
          {
            userId: employee.id,
            workDays,
          },
          removedShifts
        );

        if (error) {
          toast.error(error);
        } else {
          toast.success(success);
          setRemovedShifts([]);
        }
      } catch (error) {
        toast.error("Algo salió mal.");
      }
    });
  };

  return (
    <div className="space-y-8">
      <ShiftForm
        currentDay={currentDay}
        currentShift={currentShift}
        onAddShift={addShift}
        onDayChange={handleDayChange}
        onShiftChange={handleShiftChange}
      />

      <AssignedSchedules
        isSubmitting={isLoading}
        workDays={workDays}
        employeeId={employee.id}
        employeeWorkDays={employeeWorkDays}
        removedShifts={removedShifts}
        onRemoveShift={(day, shiftIndex) => removeShift(day, shiftIndex)}
        onSaveSchedule={saveSchedule}
      />
    </div>
  );
}
