export function formatTimeTo12Hour(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "p.m." : "a.m.";
  const formattedHours = ((hours + 11) % 12) + 1; // Convertir a formato 12 horas
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
}
