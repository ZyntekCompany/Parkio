"use client";

import { Home } from "lucide-react";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import { adminRoutes, employeeRoutes } from "@/constants";
import { cn } from "@/lib/utils";
import { RouteItem } from "@/components/navigation/sidebar/route-item";

interface ContentProps {
  clientsCount: {
    monthlyClientsCount: number;
    hourlyClientsCount: number;
  };
  isAdmin: boolean;
  hasFees: boolean;
}

export function Content({ isAdmin, hasFees, clientsCount }: ContentProps) {
  const { setOpenMobile } = useSidebar();

  function handleClose() {
    setOpenMobile(false);
  }

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Aplicación</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <RouteItem
              title="Panel"
              url="/"
              Icon={Home}
              closeSidebar={handleClose}
            />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {hasFees && (
        <SidebarGroup>
          <SidebarGroupLabel>Gestión de Clientes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {employeeRoutes.map(({ url, icon: Icon, title }) => {
                const count =
                  title === "Mensuales"
                    ? clientsCount.monthlyClientsCount
                    : clientsCount.hourlyClientsCount;

                return (
                  <RouteItem
                    key={url}
                    title={title}
                    url={url}
                    Icon={Icon}
                    showMenuBadge
                    menuBadgeLabel={count}
                    closeSidebar={handleClose}
                  />
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}

      <SidebarGroup className={cn(!isAdmin && "hidden")}>
        <SidebarGroupLabel>Administración</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {adminRoutes.map(({ url, icon: Icon, title }) => (
              <RouteItem
                key={url}
                title={title}
                url={url}
                Icon={Icon}
                closeSidebar={handleClose}
              />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
