import React from "react";
import { cookies } from "next/headers";

import { AppSidebar } from "@/components/navigation/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { MainHeader } from "@/components/common/main-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen} className="h-full overflow-hidden">
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        <MainHeader />
        <main className="p-4 overflow-y-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
