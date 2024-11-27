import { redirect } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Heading } from "@/components/common/heading";
import { CreateEmployeeTrigger } from "./_components/create-employee-trigger";
import { DataTable } from "@/components/common/data-table";
import { getUsers } from "@/actions/user";
import { columns, UserColumns } from "./_components/columns";
import { currentUser } from "@/lib/auth-user";
import { roles } from "@/constants";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default async function EmployeeManagmentPage() {
  const loggedUser = await currentUser();

  const isAdmin =
    loggedUser?.role === "Admin" || loggedUser?.role === "SuperAdmin";

  if (!isAdmin) {
    redirect("/");
  }

  const users = await getUsers(loggedUser.id!);

  const formattedUsers: UserColumns[] = users.map((user) => ({
    id: user.id,
    image: user.image!,
    name: user.name!,
    email: user.email!,
    phone: user.phone!,
    role: user.role,
    createdAt: format(user.createdAt, "d 'de' MMMM, yyyy", { locale: es }),
  }));

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
          <DataTable
            searchKey="name"
            searchPlaceholder="Filtrar por nombre..."
            showFilterSelect
            filterColumnName="role"
            filterDefault="Todos"
            filters={roles}
            columns={columns}
            data={formattedUsers}
          />
        </CardContent>
      </Card>
      {/* <div className="flex md-plus:flex-row flex-col justify-between md-plus:items-center gap-3 max-sm:px-3">
        
      </div> */}
    </div>
  );
}
