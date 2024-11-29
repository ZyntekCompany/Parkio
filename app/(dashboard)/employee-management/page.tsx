import { Suspense } from "react";
import { Heading } from "@/components/common/heading";
import { CreateEmployeeTrigger } from "./_components/create-employee-trigger";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmployeeManagementTable } from "./_components/employee-management-table";
import { TableCardSkeleton } from "@/components/skeletons/table-card-skeleton";
import { employeeManagementColumns } from "@/constants";

export default function EmployeeManagmentPage() {
  return (
    <div className="xs:p-4 space-y-6">
      <Card className="dark:bg-muted/20 bg-muted-foreground/5">
        <CardHeader className="px-4 sm:p-6">
          <div className="flex md-plus:flex-row flex-col justify-between md-plus:items-center gap-3">
            <Heading
              title="Gestión de Empleados"
              description="Administra y optimiza fácilmente los datos de tu personal."
            />
            <CreateEmployeeTrigger />
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:p-6">
          <Suspense
            fallback={
              <TableCardSkeleton
                inputPlaceholder="Buscar por nombre..."
                columns={employeeManagementColumns}
              />
            }
          >
            <EmployeeManagementTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
