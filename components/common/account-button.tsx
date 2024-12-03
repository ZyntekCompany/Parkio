"use client";

import { BadgeCheck } from "lucide-react";
import { useRouter } from "next/navigation";

import { DropdownMenuItem } from "../ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "../ui/sidebar";

export function AccountButton() {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <DropdownMenuItem
      onClick={() => {
        router.push("/account");
        if (isMobile) {
          setOpenMobile(false);
        }
      }}
    >
      <BadgeCheck />
      Cuenta
    </DropdownMenuItem>
  );
}
