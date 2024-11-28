import { CarFront } from "lucide-react";

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getCurrentParkingLot } from "@/actions/business-config";

export async function Header() {
  const currentParkingLot = await getCurrentParkingLot();

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <div>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-b from-blue-600 to-blue-700 text-sidebar-primary-foreground">
                <CarFront className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {currentParkingLot?.name}
                </span>
                <span className="truncate text-xs">Empresa</span>
              </div>
            </SidebarMenuButton>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
