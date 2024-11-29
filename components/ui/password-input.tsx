"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check, Eye, EyeOff, X } from "lucide-react";
import React, { useMemo, useState } from "react";

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  isSubmitting: boolean;
}

// interface PasswordInputProps {
//   // label: string;
//   // isSubmitting: boolean;
//   // field:
//   //   | ControllerRenderProps<
//   //       {
//   //         email: string;
//   //         password: string;
//   //       },
//   //       "password"
//   //     >
//   //   | ControllerRenderProps<
//   //       {
//   //         email: string;
//   //         name: string;
//   //         phone: string;
//   //         password?: string | undefined;
//   //       },
//   //       "password"
//   //     >
//   //   | ControllerRenderProps<
//   //       {
//   //         email: string;
//   //         name: string;
//   //         role: string;
//   //         phone: string;
//   //         password?: string | undefined;
//   //       },
//   //       "password"
//   //     >
//   //   | ControllerRenderProps<
//   //       {
//   //         oldPassword: string;
//   //         newPassword: string;
//   //       },
//   //       "oldPassword"
//   //     >
//   //   | ControllerRenderProps<
//   //       {
//   //         oldPassword: string;
//   //         newPassword: string;
//   //       },
//   //       "newPassword"
//   //     >;
// }

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, isSubmitting, value, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const toggleVisibility = () => setIsVisible((prevState) => !prevState);

    const checkStrength = (pass: string) => {
      const requirements = [
        { regex: /.{8,}/, text: "Mínimo 8 caracteres" },
        { regex: /[0-9]/, text: "Al menos 1 número" },
        { regex: /[A-Z]/, text: "Al menos 1 mayúscula" },
        {
          regex: /[!@#$%^&*(),.?":{}|<>]/,
          text: "Al menos 1 carácter especial",
        },
      ];

      return requirements.map((req) => ({
        met: req.regex.test(pass),
        text: req.text,
      }));
    };

    const strength = checkStrength((value as string) ?? "");

    const strengthScore = useMemo(() => {
      return strength.filter((req) => req.met).length;
    }, [strength]);

    const getStrengthColor = (score: number) => {
      if (score === 0) return "bg-border";
      if (score <= 1) return "bg-red-500";
      if (score <= 2) return "bg-orange-500";
      if (score === 3) return "bg-amber-500";
      return "bg-emerald-500";
    };

    const getStrengthText = (score: number) => {
      if (score === 0) return "Introduzca una contraseña";
      if (score <= 2) return "Contraseña débil";
      if (score === 3) return "Contraseña media";
      return "Contraseña segura";
    };

    return (
      <div>
        {/* Password input field with toggle visibility button */}
        <div className="space-y-2">
          <Label htmlFor="input-51">{label}</Label>
          <div className="relative">
            <Input
              id="input-51"
              className={cn("pe-9", className)}
              disabled={isSubmitting}
              placeholder="Contraseña"
              type={isVisible ? "text" : "password"}
              ref={ref}
              {...props}
              aria-invalid={strengthScore < 4}
              aria-describedby="password-strength"
            />
            <button
              className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              onClick={toggleVisibility}
              aria-label={isVisible ? "Hide password" : "Show password"}
              aria-pressed={isVisible}
              aria-controls="password"
            >
              {isVisible ? (
                <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
              ) : (
                <Eye size={16} strokeWidth={2} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Password strength indicator */}
        <div
          className="mb-4 mt-3 h-[5px] w-full overflow-hidden rounded-full bg-border"
          role="progressbar"
          aria-valuenow={strengthScore}
          aria-valuemin={0}
          aria-valuemax={4}
          aria-label="Password strength"
        >
          <div
            className={`h-full ${getStrengthColor(
              strengthScore
            )} transition-all duration-500 ease-out`}
            style={{ width: `${(strengthScore / 4) * 100}%` }}
          ></div>
        </div>

        {/* Password strength description */}
        <p
          id="password-strength"
          className="mb-2 text-sm font-medium text-foreground"
        >
          {getStrengthText(strengthScore)}. Debe contener:
        </p>

        {/* Password requirements list */}
        <ul className="space-y-1.5" aria-label="Password requirements">
          {strength.map((req, index) => (
            <li key={index} className="flex items-center gap-2">
              {req.met ? (
                <Check
                  size={16}
                  className="text-emerald-500"
                  aria-hidden="true"
                />
              ) : (
                <X
                  size={16}
                  className="text-muted-foreground/80"
                  aria-hidden="true"
                />
              )}
              <span
                className={`text-xs ${
                  req.met ? "text-emerald-600" : "text-muted-foreground"
                }`}
              >
                {req.text}
                <span className="sr-only">
                  {req.met ? " - Requirement met" : " - Requirement not met"}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
