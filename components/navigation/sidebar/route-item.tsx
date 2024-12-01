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
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarRouteItemProps {
  title: string;
  url: string;
  Icon: LucideIcon;
  showMenuBadge?: boolean;
  menuBadgeLabel?: number;
  closeSidebar: () => void;
}

export function RouteItem({
  title,
  url,
  Icon,
  showMenuBadge,
  menuBadgeLabel,
  closeSidebar,
}: SidebarRouteItemProps) {
  const { state } = useSidebar();
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const isActive = pathname === url;

  return (
    <SidebarMenuItem onClick={isMobile ? closeSidebar : () => {}}>
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
      {showMenuBadge && (
        <SidebarMenuBadge>
          <span className={cn(isActive && "text-white dark:text-white")}>
            {menuBadgeLabel}
          </span>
        </SidebarMenuBadge>
      )}
    </SidebarMenuItem>
  );
}
