import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";

interface ReportPreviewSkeletonProps {
  reportType: string;
}

export function ReportPreviewSkeleton({
  reportType,
}: ReportPreviewSkeletonProps) {
  return (
    <Card className="dark:bg-muted/20 bg-muted-foreground/5 overflow-hidden max-w-[1200px] mx-auto rounded-md">
      <CardHeader>
        <CardTitle>Vista Previa del Reporte</CardTitle>
        <CardDescription className="text-lg">{reportType}</CardDescription>
        <Skeleton className="h-4 w-[200px]" />
      </CardHeader>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10 rounded-none" />
        ))}
      </div>
    </Card>
  );
}
