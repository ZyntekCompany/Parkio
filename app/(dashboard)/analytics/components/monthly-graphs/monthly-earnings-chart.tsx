"use client";

import { useMemo, useState } from "react";
import { DateTime } from "luxon";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { formatToCOP } from "@/utils/format-to-cop";

const chartConfig = {
  earnings: {
    label: "Ganancias: ",
  },
  hourlyClientsEarnings: {
    label: "Clientes por Hora",
    color: "hsl(var(--chart-1))",
  },
  monthlyClientsEarnings: {
    label: "Clientes Mensuales",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface MonthlyEarningsChartProps {
  chartData: {
    day: string;
    hourlyClientsEarnings: number;
    monthlyClientsEarnings: number;
  }[];
}

export function MonthlyEarningsChart({ chartData }: MonthlyEarningsChartProps) {
  const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>(
    "hourlyClientsEarnings"
  );

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
    <Card className="dark:bg-muted/20 bg-muted-foreground/5">
      <CardHeader className="flex flex-wrap flex-row justify-between space-y-0 p-0">
        <div className="flex flex-col justify-center gap-1 px-6 py-5 sm:py-6 flex-1 border-b select-none">
          <div className="flex flex-1 flex-col justify-center gap-1 sm:min-w-[370px] min-w-full w-full sm:w-fit">
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
        <div className="flex sm:min-w-[400px] xl:max-w-[520px] min-w-full flex-1 border-b">
          {["hourlyClientsEarnings", "monthlyClientsEarnings"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left even:border-l data-[active=true]:dark:bg-muted/50 data-[active=true]:bg-muted-foreground/10 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {formatToCOP(total[key as keyof typeof total])}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="px-0 pt-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
              <linearGradient id="colorActiveChart" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={`var(--color-${activeChart})`}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-${activeChart})`}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent nameKey="earnings" indicator="line" />
              }
            />
            <Area
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              fillOpacity={1}
              fill="url(#colorActiveChart)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
