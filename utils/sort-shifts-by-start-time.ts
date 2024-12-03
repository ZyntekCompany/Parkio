// Función que se encarga de ordenar los turnos de menor a mayor, es decir, mañana - tarde
export function sortShiftsByStartTime(
  shifts?: { startTime: string; endTime: string }[]
): { startTime: string; endTime: string }[] {
  if (!shifts) {
    return [];
  } else {
    return shifts.sort((a, b) => {
      const timeA = new Date(`1970-01-01T${a.startTime}`).getTime();
      const timeB = new Date(`1970-01-01T${b.startTime}`).getTime();
      return timeA - timeB;
    });
  }
}
