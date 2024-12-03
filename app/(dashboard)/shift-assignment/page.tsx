import { currentRole } from "@/lib/auth-user";
import { ShiftAssigment } from "./components/shift-assigment";
import { redirect } from "next/navigation";

export default async function ShiftAssigmentPage() {
  const role = await currentRole();

  const isAdmin = role === "Admin" || role === "SuperAdmin";

  if (!isAdmin) {
    redirect("/");
  }

  return <ShiftAssigment />;
}
