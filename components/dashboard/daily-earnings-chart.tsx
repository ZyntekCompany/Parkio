"use client";

import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Wallet } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { cn } from "@/lib/utils";
import { formatToCOP } from "@/utils/format-to-cop";

const chartConfig = {
  hourlyEarnings: {
    label: "Ganancias",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface DailyEarningsProps {
  earningData: {
    hourlyClientsStillInParking: number;
    hourlyClientsCount: number;
    monthlyClientsCount: number;
    hourlyEarnings: number;
    monthlyEarnings: number;
    totalEarnings: number;
  };
  chartData: {
    hour: string;
    earnings: any;
  }[];
}

export function DailyEarningsChart({
  earningData,
  chartData,
}: DailyEarningsProps) {
  const {
    hourlyClientsStillInParking,
    hourlyEarnings,
    monthlyEarnings,
    totalEarnings,
    hourlyClientsCount,
    monthlyClientsCount,
  } = earningData;

  const today = new Date();
  const formattedDate = format(today, "d 'de' MMMM, yyyy", { locale: es });

  return (
    <div>
      <Card className="dark:bg-muted/20 bg-muted-foreground/5">
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 md-plus:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <div className="text-sm text-muted-foreground">
              Ganancias Totales del Día
            </div>
            <div className="flex items-baseline gap-2">
              <CardTitle className="text-4xl font-bold">
                {formatToCOP(totalEarnings)}
              </CardTitle>
            </div>
            <div className="text-sm text-muted-foreground">
              Hoy, {formattedDate}
            </div>
          </div>
          <div className="flex md-plus:min-w-[400px]">
            <EarningsCard
              title="Clientes por Hora"
              totalEarnings={hourlyEarnings}
              clientCounts={hourlyClientsCount}
            />
            <EarningsCard
              title="Clientes Mensuales"
              totalEarnings={monthlyEarnings}
              clientCounts={monthlyClientsCount}
            />
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="hour"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="hourlyEarnings"
                  />
                }
              />
              <Line
                dataKey="earnings"
                type="monotone"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex items-center gap-3 flex-wrap">
          <DailyStatisticsCard
            title="Clientes por Hora"
            subtitle="Clientes restantes"
            value={hourlyClientsStillInParking ?? 0}
          />
          <DailyStatisticsCard
            title="Hora de Mayor Ingresos"
            subtitle="Últimas 20 horas"
            value={formatToCOP(totalEarnings / 20)}
          />
          <DailyStatisticsCard
            title="Promedio Diario"
            subtitle="Mayor Ingresos"
            value={
              chartData.reduce((max, entry) =>
                entry.earnings > max.earnings ? entry : max
              ).hour
            }
          />
        </CardFooter>
      </Card>
    </div>
  );
}

interface EarningsCard {
  title: string;
  totalEarnings: number;
  clientCounts: number;
}

function EarningsCard({ title, totalEarnings, clientCounts }: EarningsCard) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l dark:bg-muted/50 bg-muted-foreground/10 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
      <span className="text-xs text-muted-foreground">{title}</span>
      <span className="text-lg font-bold leading-none sm:text-3xl">
        {formatToCOP(totalEarnings)}
      </span>
      <span
        className={cn(
          "text-xs text-muted-foreground",
          clientCounts !== 0 && "text-green-500"
        )}
      >
        Clientes totales: {clientCounts}
      </span>
    </div>
  );
}

interface DailyStatisticsCardProps {
  title: string;
  subtitle: string;
  value: string | number;
}

function DailyStatisticsCard({
  title,
  subtitle,
  value,
}: DailyStatisticsCardProps) {
  return (
    <Card className="flex-1 dark:bg-muted/50 bg-muted-foreground/10 sm:min-w-[263px] min-w-full">
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">
            {title}
          </span>
        </div>
        <div className="mt-2">
          <span className="text-xl font-bold leading-none sm:text-2xl">
            {value}
          </span>
        </div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </CardContent>
    </Card>
  );
}
