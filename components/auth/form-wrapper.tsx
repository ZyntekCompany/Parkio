"use client";

import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface FormWrapperProps {
  type: "login" | "register" | "other";
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function FormWrapper({
  type,
  title,
  description,
  children,
  className,
}: FormWrapperProps) {
  const router = useRouter();

  const footerLabel =
    type === "register" ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?";

  return (
    <div
      className={cn(
        "rounded-2xl sm:p-8 w-full max-w-lg xl:max-w-xl mx-3",
        className
      )}
    >
      {/* Logo */}
      <div className="pb-8 flex items-center justify-center">
        <Logo />
      </div>

      {/* Header */}
      <div className="flex flex-col items-center justify-center text-center mb-8">
        <h2 className="text-2xl sm:text-3xl tracking-tight font-bold mb-2">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-accent-foreground/45 max-w-xs">
          {description}
        </p>
      </div>

      {/* Content */}
      {children}

      {type === "other" && (
        <div className="mt-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.back()}
          >
            <ArrowLeft />
            Volver
          </Button>
        </div>
      )}
    </div>
  );
}
