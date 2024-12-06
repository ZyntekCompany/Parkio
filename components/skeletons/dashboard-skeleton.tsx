import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader } from "../ui/card";

export function DashboardSkeleton() {
  return (
    <>
      <Card className="dark:bg-muted/20 bg-muted-foreground/5 space-y-6">
        <CardHeader className="flex flex-wrap flex-row justify-between space-y-0 p-0">
          <div className="flex flex-col justify-center gap-1 px-6 py-5 sm:py-6 flex-1 border-b select-none">
            <div className="flex flex-1 flex-col justify-center gap-1 sm:min-w-[370px] min-w-full w-full sm:w-fit">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-48 mt-1" />
              <Skeleton className="h-4 w-40 mt-1" />
            </div>
          </div>
          <div className="flex sm:min-w-[400px] xl:max-w-[520px] min-w-full flex-1 border-b">
            {[0, 1].map((index) => (
              <div
                key={index}
                className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left even:border-l sm:border-l sm:px-8 sm:py-6"
              >
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-32 mt-1" />
              </div>
            ))}
          </div>
        </CardHeader>

        {/* Graph skeleton */}
        <Skeleton className="h-[300px] w-full" />

        {/* Bottom metrics skeleton */}
        <div className="grid gap-4 md:grid-cols-3 p-4">
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
      </Card>
    </>
  );
}
