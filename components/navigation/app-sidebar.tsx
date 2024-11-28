import { Sidebar } from "@/components/ui/sidebar";
import { Header } from "@/components/navigation/sidebar/header";
import { Footer } from "@/components/navigation/sidebar/footer";
import { Content } from "@/components/navigation/sidebar/content";
import { currentRole } from "@/lib/auth-user";
import { getFees } from "@/actions/business-config";
import { getClientsCount } from "@/actions/common";

export async function AppSidebar() {
  const role = await currentRole();
  const clientsCount = await getClientsCount();

  const fees = await getFees();

  const hasFees = fees.length > 0;

  const isAdmin = role === "SuperAdmin" || role === "Admin";

  return (
    <Sidebar variant="inset" collapsible="icon">
      <Header />
      <Content
        isAdmin={isAdmin}
        hasFees={hasFees}
        clientsCount={clientsCount}
      />
      <Footer />
    </Sidebar>
  );
}
