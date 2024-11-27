"use client";

import { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface SidebarRouteItemProps {
  title: string;
  url: string;
  Icon: LucideIcon;
  showMenuBadge?: boolean;
  menuBadgeLabel?: string;
}

export function RouteItem({
  title,
  url,
  Icon,
  showMenuBadge,
  menuBadgeLabel,
}: SidebarRouteItemProps) {
  const { state } = useSidebar();
  const pathname = usePathname();

  const isActive = pathname === url;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        tooltip={{
          children: title,
          hidden: state === "expanded" ? true : false,
        }}
        asChild
      >
        <Link href={url}>
          <Icon />
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
      {showMenuBadge && <SidebarMenuBadge>{menuBadgeLabel}</SidebarMenuBadge>}
    </SidebarMenuItem>
  );
}
