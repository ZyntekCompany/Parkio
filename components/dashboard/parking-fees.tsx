"use client";

import { useState } from "react";
import { FeeCategory } from "@prisma/client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatToCOP } from "@/utils/format-to-cop";

interface ParkingFeesProps {
  feesData: {
    clientTypes: {
      name: string | null;
    }[];
    fees: {
      id: string;
      clientType: {
        name: string;
      };
      vehicleType: {
        name: string;
      };
      feeType: FeeCategory;
      price: number;
    }[];
  };
}

export default function ParkingFees({ feesData }: ParkingFeesProps) {
  const [selectedFeeType, setSelectedFeeType] = useState<FeeCategory>("HOURLY");
  const [selectedClientType, setSelectedClientType] = useState(
    feesData.clientTypes[0].name!
  );

  const filteredFees = feesData.fees.filter(
    (fee) =>
      fee.feeType === selectedFeeType &&
      fee.clientType.name === selectedClientType
  );

  return (
    <Card className="w-full dark:bg-muted/20 bg-muted-foreground/5">
      <CardHeader className="flex flex-col max-md-plus:justify-start space-y-0 gap-4 border-b p-0 md-plus:flex-row px-6 py-5 sm:py-6">
        <div className="flex-1">
          <CardTitle className="text-2xl font-bold">
            Tarifas Disponibles
          </CardTitle>
        </div>
        <div className="flex items-center gap-4 justify-end">
          <Select
            onValueChange={(value: FeeCategory) => setSelectedFeeType(value)}
            defaultValue={selectedFeeType}
          >
            <SelectTrigger className="w-full sm:w-[200px] dark:bg-muted/50 bg-muted-foreground/10">
              <SelectValue placeholder="Seleccionar tipo de tarifa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HOURLY">Por Hora</SelectItem>
              <SelectItem value="MONTHLY">Mensual</SelectItem>
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value: string) => setSelectedClientType(value)}
            defaultValue={selectedClientType}
          >
            <SelectTrigger className="w-full dark:bg-muted/50 bg-muted-foreground/10">
              <SelectValue placeholder="Seleccionar tipo de usuario" />
            </SelectTrigger>
            <SelectContent>
              {feesData.clientTypes.map(({ name }) => (
                <SelectItem key={name} value={name!}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      {filteredFees.length === 0 ? (
        <p className="text-center text-gray-500 my-4">
          No hay tarifas disponibles para esta categoría.
        </p>
      ) : (
        <div className="flex flex-wrap gap-4 px-6 py-5 sm:py-6">
          {filteredFees.map((fee) => (
            <Card
              key={fee.id}
              className="flex-1 overflow-hidden dark:bg-muted/50 bg-muted-foreground/10 sm:min-w-[287px] min-w-full"
            >
              <CardHeader className="p-4">
                <CardTitle className="text-lg font-semibold flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {fee.vehicleType.name}
                    </h3>
                    <p className="text-sm text-zinc-400">
                      {fee.clientType.name}
                    </p>
                  </div>
                  <div className="text-sm dark:text-zinc-400 text-zinc-600">
                    <p className="text-2xl font-bold">
                      {formatToCOP(fee.price)}
                    </p>
                    {selectedFeeType === "HOURLY" ? "/hora" : "/mes"}
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
}
