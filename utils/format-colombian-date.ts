import { DateTime } from "luxon";

// Función para formatear la fecha en español en la zona horaria de Colombia
export function formatColombianDate(date: Date, showHour?: boolean): string {
  const timeZone = "America/Bogota"; // Zona horaria de Colombia
  // Crear un objeto DateTime y ajustarlo a la zona horaria de Colombia
  const zonedDate = DateTime.fromJSDate(date).setZone(timeZone);

  // Formatear la fecha en el formato deseado
  return showHour ? zonedDate.toFormat("d 'de' MMMM, yyyy, h:mm a", { locale: "es" }) : zonedDate.toFormat("d 'de' MMMM, yyyy", { locale: "es" });
}