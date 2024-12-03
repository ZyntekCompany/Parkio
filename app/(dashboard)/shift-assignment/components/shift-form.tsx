"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { daysOfWeek } from "@/constants";
import { FormattedShift } from "@/types";

interface ShiftFormProps {
  currentDay: string;
  currentShift: FormattedShift;
  onDayChange: (day: string) => void;
  onShiftChange: (field: "startTime" | "endTime", value: string) => void;
  onAddShift: () => void;
}

export function ShiftForm({
  currentDay,
  currentShift,
  onAddShift,
  onDayChange,
  onShiftChange,
}: ShiftFormProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto dark:bg-muted/20 bg-muted-foreground/5 overflow-hidden">
      <CardHeader>
        <CardTitle>Asignar Horario</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="day-select">Día de la semana</Label>
            <Select onValueChange={onDayChange} value={currentDay}>
              <SelectTrigger id="day-select">
                <SelectValue placeholder="Selecciona un día" />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Añadir turno</Label>
            <div className="space-y-5">
              <div className="flex xs:flex-row flex-col items-center gap-2">
                <div className="flex-1 w-full">
                  <Input
                    type="time"
                    value={currentShift.startTime}
                    onChange={(e) => onShiftChange("startTime", e.target.value)}
                    placeholder="Hora de inicio"
                  />
                  <span className="text-accent-foreground/50 text-sm">
                    Hora de inicio
                  </span>
                </div>
                <div className="flex-1 w-full">
                  <Input
                    type="time"
                    value={currentShift.endTime}
                    onChange={(e) => onShiftChange("endTime", e.target.value)}
                    placeholder="Hora de fin"
                  />
                  <span className="text-accent-foreground/50 text-sm">
                    Hora de finalización
                  </span>
                </div>
              </div>
              <Button
                disabled={
                  !currentDay ||
                  !currentShift.startTime ||
                  !currentShift.endTime
                }
                className="w-full"
                onClick={onAddShift}
              >
                Añadir
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
