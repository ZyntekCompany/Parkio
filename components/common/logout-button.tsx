"use client";

import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { logout } from "@/actions/auth";

interface LogoutButtonProps {
  hideText?: boolean;
}

export function LogoutButton({ hideText }: LogoutButtonProps) {
  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      toast.error("Error.", {
        description: "Algo salió mal al cerrar sesión.",
      });
    }
  };
  return (
    <div
      onClick={handleLogout}
      className="flex items-center gap-2 w-full px-[8px] py-[6px]"
    >
      <LogOut />
      <span className={cn(hideText && "hidden")}>Cerrar sesión</span>
    </div>
  );
}
