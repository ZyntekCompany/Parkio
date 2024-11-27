import { cn } from "@/lib/utils";
import * as React from "react";
import { SVGProps } from "react";

interface LogoProps {
  name: string;
  className?: string;
  fill?: string;
  dinamicTextColor?: boolean;
  props?: SVGProps<SVGSVGElement>;
}

export function Logo({
  name,
  className,
  fill = "#007DFC",
  dinamicTextColor = false,
  props,
}: LogoProps) {
  return (
    <div className={cn("select-none flex items-center gap-2", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={40}
        height={40}
        fill="none"
        {...props}
      >
        <path
          fill={fill}
          fillRule="evenodd"
          d="M25.556 11.685A10 10 0 0 0 20 10V0A20 20 0 1 1 0 20h10a10 10 0 1 0 15.556-8.315Z"
          className="ccustom"
          clipRule="evenodd"
        />
        <path
          fill={fill}
          fillRule="evenodd"
          d="M10 0A10 10 0 0 1 0 10v10A20 20 0 0 0 20 0H10Z"
          className="ccustom"
          clipRule="evenodd"
        />
      </svg>
      <span
        className={cn(
          "text-[16px] font-medium tracking-wider text-secondary",
          dinamicTextColor && "dark:text-primary text-primary-foreground"
        )}
      >
        {name}
      </span>
    </div>
  );
}
