import { getWorkDaysByCurrentEmployeeId } from "@/actions/shift-assigment";
import { ShiftsTable } from "@/components/common/shifts-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export async function ScheduleTable() {
  const workDays = await getWorkDaysByCurrentEmployeeId();

  return (
    <Card className="max-xs:p-0 dark:bg-muted/20 bg-muted-foreground/5 space-y-0 py-2">
      <CardHeader className="py-2 px-4 pt-4 pb-2 md:px-6 md:py-3">
        <CardTitle>Turnos de Trabajo</CardTitle>
        <CardDescription>
          Aquí puedes visualizar tu horario laboral.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-4 md:px-6 md:py-3">
        <ShiftsTable workDays={workDays} />
      </CardContent>
    </Card>
  );
}
