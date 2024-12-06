import { Suspense } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CurrentMonthEarningsGraphs } from "./monthly-graphs/current-month-earnings-graphs";
import { CurrentYearEarningsGraphs } from "./yearly-graphs/current-year-earnings-graphs";
import { GraphCardSkeleton } from "@/components/skeletons/graph-card-skeleton";

export function EarningsGraphs() {
  return (
    <div>
      <div className="flex items-center justify-end">
        <Tabs defaultValue="month" className="w-full">
          <TabsList className="bg-transparent gap-2 mb-2 px-0 justify-start">
            <TabsTrigger
              className="data-[state=active]:bg-muted-foreground/15 hover:bg-muted/35"
              value="month"
            >
              Mes actual
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-muted-foreground/15 hover:bg-muted/35"
              value="year"
            >
              Año actual
            </TabsTrigger>
          </TabsList>
          <TabsContent value="month" className="mt-8">
            <Suspense fallback={<GraphSkeletons />}>
              <CurrentMonthEarningsGraphs />
            </Suspense>
          </TabsContent>
          <TabsContent value="year" className="mt-8">
            <Suspense fallback={<GraphSkeletons />}>
              <CurrentYearEarningsGraphs />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function GraphSkeletons() {
  return (
    <div>
      <GraphCardSkeleton />
      <GraphCardSkeleton />
    </div>
  );
}
