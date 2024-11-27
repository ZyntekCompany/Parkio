"use client";

import { Home } from "lucide-react";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { adminRoutes, employeeRoutes } from "@/constants";
import { cn } from "@/lib/utils";
import { RouteItem } from "@/components/navigation/sidebar/route-item";

interface ContentProps {
  isAdmin: boolean;
}

export function Content({ isAdmin }: ContentProps) {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Aplicación</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <RouteItem title="Panel" url="/" Icon={Home} />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Gestión de Clientes</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {employeeRoutes.map(({ url, icon: Icon, title }) => (
              <RouteItem
                key={url}
                title={title}
                url={url}
                Icon={Icon}
                showMenuBadge
                menuBadgeLabel="0"
              />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup className={cn(!isAdmin && "hidden")}>
        <SidebarGroupLabel>Administración</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {adminRoutes.map(({ url, icon: Icon, title }) => (
              <RouteItem key={url} title={title} url={url} Icon={Icon} />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
