import React from "react";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent } from "../ui/card";

export function DashboardSkeleton() {
  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="col-span-2">
            <div className="space-y-2">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>

        {/* Graph skeleton */}
        <Skeleton className="h-[300px] w-full" />

        {/* Bottom metrics skeleton */}
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-card">
              <CardContent className="p-6 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
