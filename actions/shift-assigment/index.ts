"use server";

import { currentUser } from "@/lib/auth-user";
import { db } from "@/lib/db";
import { FormattedShift, FormattedWorkDay } from "@/types";
import { revalidatePath } from "next/cache";

export async function getWorkDaysByCurrentEmployeeId() {
  try {
    const loggedUser = await currentUser();

    const workDays = await db.workDay.findMany({
      where: {
        userId: loggedUser?.id!,
      },
      include: {
        shifts: true
      }
    });

    return workDays;
  } catch (error) {
    return [];
  }
}

export async function createShifts(
  data: {
    userId: string;
    workDays: FormattedWorkDay[];
  },
  removedShifts: FormattedShift[]
) {
  const { userId, workDays } = data;

  if (removedShifts.length > 0) {
    // Remueve todos los shifts de la base de datos que coincidan con el id de cada uno de los objetos de removed shifts
    await db.shift.deleteMany({
      where: {
        id: {
          in: removedShifts.map((shift) => shift.id!),
        },
      },
    });

    // Valida si quedó algun dia sin shifts
    const workDaysWithoutShifts = await db.workDay.findMany({
      where: {
        OR: [{ shifts: { none: {} } }],
      },
    });

    // Se encarga de eliminar los workDay que no tienen shifts
    if (workDaysWithoutShifts) {
      await db.workDay.deleteMany({
        where: {
          id: {
            in: workDaysWithoutShifts.map((wd) => wd.id),
          },
        },
      });
    }
  }

  for (const workDay of workDays) {
    const { day, shifts } = workDay;

    // Encuentra o crea el WorkDay
    let dbWorkDay = await db.workDay.findUnique({
      where: { day_userId: { day, userId } },
    });

    if (!dbWorkDay) {
      dbWorkDay = await db.workDay.create({
        data: {
          day,
          userId,
        },
      });
    }

    for (const shift of shifts) {
      const { startTime, endTime, id } = shift;

      if (
        new Date(`1970-01-01T${startTime}`) >= new Date(`1970-01-01T${endTime}`)
      ) {
        return { error: "El inicio del turno debe ser antes del fin." };
      }

      if (!id) {
        // Verifica conflictos con otros turnos del mismo día para el usuario
        const conflictingShifts = await db.shift.findMany({
          where: {
            workDayId: dbWorkDay.id,
            OR: [
              {
                startTime: { lte: endTime },
                endTime: { gte: startTime },
              },
            ],
          },
        });

        if (conflictingShifts.length > 0) {
          return {
            error: `El turno (${startTime} - ${endTime}) en ${day} se superpone con otro existente.`,
          };
        }

        // Crea el turno
        await db.shift.create({
          data: {
            startTime,
            endTime,
            workDayId: dbWorkDay.id,
          },
        });
      }
    }
  }

  revalidatePath("/shift-assignment");
  return { success: "Turnos asignados exitosamente." };
}

export async function deleteShifts(employeeId: string) {
  try {
    if (!employeeId) {
      return { error: "El ID del empleado es requerido." };
    }

    const existingEmployee = await db.user.findUnique({
      where: {
        id: employeeId,
      },
    });

    if (!existingEmployee) {
      return { error: "El empleado con el ID proporcionado no existe." };
    }

    const existingWorkDays = await db.workDay.findMany({
      where: {
        userId: employeeId,
      },
    });

    if (!existingWorkDays || existingWorkDays.length === 0) {
      return { error: "No hay turnos a eliminar para el empleado." };
    }

    await db.workDay.deleteMany({
      where: {
        userId: employeeId,
      },
    });

    revalidatePath("/shift-assignment");
    return { success: "Turnos eliminados exitosamente." };
  } catch (error) {
    return { error: "Algo salió mal en el proceso." };
  }
}
