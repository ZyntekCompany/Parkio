"use client";

import React from "react";

import { Input } from "@/components/ui/input";

export interface PlateInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isSubmitting: boolean;
}

const PlateInput = React.forwardRef<HTMLInputElement, PlateInputProps>(
  ({ className, isSubmitting, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <Input
          autoComplete="off"
          disabled={isSubmitting}
          maxLength={7}
          style={{ textTransform: "uppercase" }}
          placeholder="--- ---"
          className={className}
          {...props}
          ref={ref}
        />
      </div>
    );
  }
);
PlateInput.displayName = "PlateInput";

export { PlateInput };
