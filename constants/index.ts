import {
  CalendarClock,
  ChartColumnBig,
  Clock,
  Cog,
  UserCheck,
  UserCog,
} from "lucide-react";

export const employeeRoutes = [
  {
    title: "Por hora",
    url: "/hourly-clients",
    icon: Clock,
  },
  {
    title: "Mensuales",
    url: "/monthly-clients",
    icon: UserCheck,
  },
];

export const adminRoutes = [
  {
    title: "Analíticas",
    url: "/analytics",
    icon: ChartColumnBig,
  },
  {
    title: "Asignación de turnos",
    url: "/shift-assignment",
    icon: CalendarClock,
  },
  {
    title: "Gestión de empleados",
    url: "/employee-management",
    icon: UserCog,
  },
  {
    title: "Configuración",
    url: "/business-configuration",
    icon: Cog,
  },
];

export const roles = ["Admin", "Empleado", "Todos"];
