"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import ScheduleAssignment from "./schedule-assigment";
import UserSelectButton from "./user-select-button";
import {
  EmployeeExtendedWithWorkDays,
  FormattedWorkDay,
  WorkDayExtended,
} from "@/types";
import { sortShiftsByStartTime } from "@/utils/sort-shifts-by-start-time";

interface UserSelectProps {
  users: EmployeeExtendedWithWorkDays[];
}

export function UserSelect({ users }: UserSelectProps) {
  const [selectedUser, setSelectedUser] =
    useState<EmployeeExtendedWithWorkDays | null>(null);

  function formatWorkDays(workDays: WorkDayExtended[]): FormattedWorkDay[] {
    return workDays.map((day) => ({
      id: day.id || undefined,
      day: day.day,
      shifts: sortShiftsByStartTime(day.shifts) || [],
    }));
  }

  useEffect(() => {
    if (selectedUser) {
      const userFound = users.find(
        (employee) => employee.id === selectedUser.id
      );

      if (userFound) {
        setSelectedUser(userFound);
      }
    }
  }, [users, selectedUser]);

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto dark:bg-muted/20 bg-muted-foreground/5 overflow-hidden">
        <CardHeader>
          <CardTitle>Seleccionar Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-select">Empleado</Label>
              <Select
                onValueChange={(value) => {
                  const user = users.find((u) => u.id === value);
                  setSelectedUser(user || null);
                }}
              >
                <SelectTrigger
                  id="user-select"
                  className="h-fit min-h-12 py-1.5"
                >
                  <SelectValue placeholder="Selecciona un usuario" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem
                      className="py-1.5 h-auto"
                      key={user.id}
                      value={user.id}
                    >
                      <UserSelectButton
                        name={user.name!}
                        userImage={user.image}
                      />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedUser && (
        <ScheduleAssignment
          employee={selectedUser}
          employeeWorkDays={formatWorkDays(selectedUser.workDays ?? [])}
        />
      )}
    </>
  );
}
