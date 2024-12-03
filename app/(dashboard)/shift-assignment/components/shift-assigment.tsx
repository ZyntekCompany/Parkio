import { getEmployees } from "@/actions/common";
import { UserSelect } from "./user-select";

export async function ShiftAssigment() {
  const employees = await getEmployees();

  return (
    <div className="space-y-8">
      <UserSelect users={employees} />
    </div>
  );
}
