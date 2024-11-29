import {
  CalendarClock,
  ChartColumnBig,
  Clock,
  Cog,
  UserCheck,
  UserCog,
} from "lucide-react";
import { MaskitoOptions } from "@maskito/core";

export const PLATE_MASK_OPTS: MaskitoOptions = {
  mask: [
    /[A-Za-z0-9]/, // Primer carácter (cualquier letra o número)
    /[A-Za-z0-9]/, // Segundo carácter
    /[A-Za-z0-9]/, // Tercer carácter
    " ", // Espacio
    /[A-Za-z0-9]/, // Cuarto carácter
    /[A-Za-z0-9]/, // Quinto carácter
    /[A-Za-z0-9]/, // Sexto carácter
  ],
};

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
