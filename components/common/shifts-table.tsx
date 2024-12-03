"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { daysOfWeek } from "@/constants";
import { FormattedWorkDay, WorkDayExtended } from "@/types";
import { formatTimeTo12Hour } from "@/utils/format-time-to-twelve-hour";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ShiftsTableProps {
  workDays: (FormattedWorkDay | WorkDayExtended)[];
  isEditable?: boolean;
  isSubmitting?: boolean;
  onRemoveShift?: (day: string, shiftIndex: number) => void;
}

export function ShiftsTable({
  workDays,
  isEditable,
  isSubmitting,
  onRemoveShift,
}: ShiftsTableProps) {
  console.log(workDays);
  return (
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
            (a, b) => daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day) // Ordena según el índice
          )
          .map((schedule, index) => (
            <TableRow key={index}>
              <TableCell>{schedule.day}</TableCell>
              <TableCell>
                {schedule.shifts?.map((shift, index) => (
                  <Badge
                    key={index}
                    className="group mr-2 mb-2 bg-muted-foreground/20 hover:bg-muted-foreground/50 p-2 text-foreground"
                  >
                    <div>
                      {formatTimeTo12Hour(shift.startTime)} -{" "}
                      {formatTimeTo12Hour(shift.endTime)}
                    </div>
                    {isEditable && onRemoveShift !== undefined && (
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
                    )}
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
  );
}
