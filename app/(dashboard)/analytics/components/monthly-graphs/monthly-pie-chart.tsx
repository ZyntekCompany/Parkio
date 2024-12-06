"use client";

import { ClientsCountByCategory } from "@/types";
import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DateTime } from "luxon";

const chartConfig = {
  count: {
    label: "Total",
  },
  hourlyClients: {
    label: "Por hora",
    color: "hsl(var(--chart-4))",
  },
  monthlyClients: {
    label: "Mensuales",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

interface MonthlyPieChartProps {
  monthlyClientsCountByCategory: ClientsCountByCategory[];
}

export default function MonthlyPieChart({
  monthlyClientsCountByCategory,
}: MonthlyPieChartProps) {
  const totalClients = useMemo(() => {
    return monthlyClientsCountByCategory.reduce(
      (acc, curr) => acc + curr.count!,
      0
    );
  }, [monthlyClientsCountByCategory]);

  const currentMonth = DateTime.now()
    .setLocale("es")
    .setZone("America/Bogota")
    .toFormat("LLLL");

  return (
    <Card className="flex flex-col dark:bg-muted/20 bg-muted-foreground/5 md:w-[290px] flex-1 sm:min-w-[310px] min-h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-center">
          Total de Clientes Actuales
        </CardTitle>
        <CardDescription className="capitalize">{currentMonth}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-lg:max-h-[250px] max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={monthlyClientsCountByCategory}
              dataKey="count"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalClients.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Clientes
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
