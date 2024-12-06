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

interface YearlyPieChartProps {
  yearlyClientsCountByCategory: ClientsCountByCategory[];
}

export default function YearlyPieChart({
  yearlyClientsCountByCategory,
}: YearlyPieChartProps) {
  const totalClients = useMemo(() => {
    return yearlyClientsCountByCategory.reduce(
      (acc, curr) => acc + curr.count!,
      0
    );
  }, [yearlyClientsCountByCategory]);

  const currentYear = DateTime.now()
    .setLocale("es")
    .setZone("America/Bogota")
    .toFormat("yyyy");

  return (
    <Card className="flex flex-col dark:bg-muted/20 bg-muted-foreground/5 md:w-[290px] flex-1 sm:min-w-[315px] min-h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-center">
          Total de Clientes Actuales
        </CardTitle>
        <CardDescription className="capitalize">
          Año {currentYear}
        </CardDescription>
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
              data={yearlyClientsCountByCategory}
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
