import { redirect } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { DataTable } from "@/components/common/data-table";
import { columns, UserColumns } from "./columns";
import { currentUser } from "@/lib/auth-user";
import { roles } from "@/constants";
import { getUsers } from "@/actions/common";

export async function EmployeeManagementTable() {
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
    <DataTable
      searchKey="name"
      searchPlaceholder="Buscar por nombre..."
      showFilterSelect
      filterColumnName="role"
      filterDefault="Todos"
      filters={roles}
      columns={columns}
      data={formattedUsers}
    />
  );
}
