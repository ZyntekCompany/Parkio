"use client";

import { Loader, LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ActionButtonProps {
  Icon: LucideIcon;
  disable: boolean;
  isLoading: boolean;
  variant: "outline" | "primary";
  label: string;
  handleOnClick: () => void;
}

export function ActionButton({
  Icon,
  disable,
  isLoading,
  variant,
  label,
  handleOnClick,
}: ActionButtonProps) {
  return (
    <Button
      variant={variant}
      disabled={disable}
      onClick={handleOnClick}
      className="max-ss:w-full"
    >
      {!isLoading ? (
        <Icon className="size-4" />
      ) : (
        <Loader className="size-4 animate-spin" />
      )}
      {label}
    </Button>
  );
}
