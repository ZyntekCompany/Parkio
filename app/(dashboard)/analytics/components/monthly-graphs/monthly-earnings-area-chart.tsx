"use client";

import { useMemo } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { formatToCOP } from "@/utils/format-to-cop";
import { DateTime } from "luxon";

const chartConfig = {
  earnings: {
    label: "Ganancias: ",
  },
  hourlyClientsEarnings: {
    label: "Por Hora",
    color: "hsl(var(--chart-1))",
  },
  monthlyClientsEarnings: {
    label: "Mensuales",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface MonthlyEarningsAreaChartProps {
  chartData: {
    day: string;
    hourlyClientsEarnings: number;
    monthlyClientsEarnings: number;
  }[];
}

export function MonthlyEarningsAreaChart({
  chartData,
}: MonthlyEarningsAreaChartProps) {
  const total = useMemo(
    () => ({
      hourlyClientsEarnings: chartData.reduce(
        (acc, curr) => acc + curr.hourlyClientsEarnings,
        0
      ),
      monthlyClientsEarnings: chartData.reduce(
        (acc, curr) => acc + curr.monthlyClientsEarnings,
        0
      ),
    }),
    [chartData]
  );

  const currentMonth = DateTime.now()
    .setLocale("es")
    .setZone("America/Bogota")
    .toFormat("LLLL");

  return (
    <Card className="dark:bg-muted/20 bg-muted-foreground/5 md:flex-1 w-full md:min-w-[950px]">
      <CardHeader className="flex justify-between space-y-0 p-0">
        <div className="flex flex-col justify-center gap-1 px-6 py-5 sm:py-6 flex-1 border-b select-none">
          <div className="flex flex-1 flex-col justify-center gap-1 w-full">
            <div className="text-sm text-muted-foreground">
              Ganancias Totales
            </div>
            <div className="flex items-baseline gap-2">
              <CardTitle className="text-4xl font-bold">
                {`${formatToCOP(
                  total.hourlyClientsEarnings + total.monthlyClientsEarnings
                )} COP`}
              </CardTitle>
            </div>
            <div className="text-sm text-muted-foreground">
              {`A lo largo del mes de ${currentMonth}`}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0 pt-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="fillHourlyClients"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-hourlyClientsEarnings)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-hourlyClientsEarnings)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient
                id="fillMonthlyClients"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-monthlyClientsEarnings)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-monthlyClientsEarnings)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <ChartTooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              type="monotone"
              dataKey="hourlyClientsEarnings"
              stroke="var(--color-hourlyClientsEarnings)"
              fillOpacity={1}
              fill="url(#fillHourlyClients)"
            />
            <Area
              type="monotone"
              dataKey="monthlyClientsEarnings"
              stroke="var(--color-monthlyClientsEarnings)"
              fillOpacity={1}
              fill="url(#fillMonthlyClients)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
