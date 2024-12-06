import {
  CalendarClock,
  ChartColumnBig,
  ClipboardList,
  Clock,
  Cog,
  UserCheck,
  UserCog,
} from "lucide-react";

export const reportTypes = [
  "Ganancias",
  "Clientes por Hora",
  "Clientes Mensuales",
  "Clientes Mensuales Próximos a Expirar",
];

export const daysOfWeek = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

export const profileTabs: {
  value: string;
  label: string;
}[] = [
  {
    value: "general",
    label: "General",
  },
  {
    value: "password",
    label: "Cambiar contraseña",
  },
  // {
  //   value: "schedule",
  //   label: "Horario",
  // },
];

export const employeeManagementColumns: {
  key: string;
  label: string;
}[] = [
  { key: "imagen", label: "Imagen" },
  { key: "nombre", label: "Nombre" },
  { key: "correo", label: "Correo" },
  { key: "telefono", label: "Teléfono" },
  { key: "role", label: "Rol" },
  { key: "fechaInicio", label: "Fecha de Inicio" },
];

export const feeConfigColumns: {
  key: string;
  label: string;
}[] = [
  { key: "tipoVehículo", label: "Tipo de Vehículo" },
  { key: "tipoCliente", label: "Tipo de Cliente" },
  { key: "tarifaHora", label: "Tarifa por Hora" },
  { key: "tarifaMes", label: "Tarifa por Mes" },
];

export const vehicleAndClientsTypeColumns: {
  key: string;
  label: string;
}[] = [
  { key: "nombre", label: "Nombre" },
  { key: "creado", label: "Creado" },
];

export const hourlyClientsColumns: {
  key: string;
  label: string;
}[] = [
  { key: "placa", label: "Placa" },
  { key: "tipoVehiculo", label: "Tipo de Vehículo" },
  { key: "tipoCliente", label: "Tipo de Cliente" },
  { key: "fechaEntrada", label: "Fecha de Entrada" },
  { key: "detallesPago", label: "Detalles de Pago" },
];

export const monthlyClientsColumns: {
  key: string;
  label: string;
}[] = [
  { key: "nombre", label: "Nombre" },
  { key: "correo", label: "Correo" },
  { key: "documento", label: "N° Documento" },
  { key: "telefono", label: "Teléfono" },
  { key: "placa", label: "Placa" },
  { key: "tipoVehiculo", label: "Tipo de Vehículo" },
  { key: "tipoCliente", label: "Tipo de Cliente" },
  { key: "fechaInicio", label: "Fecha de Inicio" },
  { key: "fechaEXpiración", label: "Fecha de Expiración" },
];

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
    title: "Reportes",
    url: "/reports",
    icon: ClipboardList,
  },
  // {
  //   title: "Asignación de turnos",
  //   url: "/shift-assignment",
  //   icon: CalendarClock,
  // },
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
