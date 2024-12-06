import {
  Client,
  ClientType,
  Shift,
  User,
  VehicleType,
  WorkDay,
} from "@prisma/client";

export type FormattedShift = {
  id?: string;
  startTime: string;
  endTime: string;
};

export type FormattedWorkDay = {
  id?: string;
  day: string;
  shifts: FormattedShift[];
};

export interface ExtendedClient extends Client {
  clientType: ClientType;
  vehicleType: VehicleType;
}

// Extensión del modelo Shift con relaciones
export interface ShiftExtended extends Shift {
  workDay?: WorkDayExtended;
}

// Extensión del modelo WorkDay con relaciones
export interface WorkDayExtended extends WorkDay {
  shifts?: ShiftExtended[];
  user?: EmployeeExtendedWithWorkDays;
}

// Extensión del modelo User con relaciones
export interface EmployeeExtendedWithWorkDays extends User {
  workDays?: WorkDayExtended[];
}

export interface HourlyClientEarningsConfig {
  earnings: {
    label: string;
  };
  hourlyClientsEarnings: {
    label: string;
    color: string;
  };
  monthlyClientsEarnings: {
    label: string;
    color: string;
  };
}

export interface MonthlyEarningsChartProps {
  day: string;
  hourlyClientsEarnings: number;
  monthlyClientsEarnings: number;
}

export interface YearlyEarningsChartProps {
  month: string;
  hourlyClientsEarnings: number;
  monthlyClientsEarnings: number;
}

export interface ClientsCountByCategory {
  category: string;
  count: number;
}

export interface ClientsCountByVehicleType {
  vehicleTypeName: string;
  count: number;
}

export interface ClientsCountByClientType {
  clientTypeName: string;
  count: number;
}