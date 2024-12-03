"use client";

import { Clock } from "lucide-react";
import {
  DateInput,
  DateSegment,
  Label,
  TimeField,
  TimeValue,
} from "react-aria-components";

interface TimeInputProps {
  description: string;
  onChange?: (value: string) => void;
}

export function TimeInput({ description, onChange }: TimeInputProps) {
  const handleChange = (value: TimeValue | null) => {
    if (onChange && value) {
      onChange(value.toString());
    }
  };

  return (
    <TimeField onChange={handleChange} className="space-y-2 flex-1">
      <Label className="text-sm font-medium text-foreground sr-only">{description}</Label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 start-0 z-10 flex items-center justify-center ps-3 text-muted-foreground/80">
          <Clock size={16} strokeWidth={2} aria-hidden="true" />
        </div>
        <DateInput className="relative inline-flex h-10 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input bg-background px-3 py-2 ps-9 text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/20">
          {(segment) => (
            <DateSegment
              segment={segment}
              className="inline rounded p-0.5 text-foreground caret-transparent outline outline-0 data-[disabled]:cursor-not-allowed data-[focused]:bg-accent data-[invalid]:data-[focused]:bg-destructive data-[type=literal]:px-0 data-[focused]:data-[placeholder]:text-foreground data-[focused]:text-foreground data-[invalid]:data-[focused]:data-[placeholder]:text-destructive-foreground data-[invalid]:data-[focused]:text-destructive-foreground data-[invalid]:data-[placeholder]:text-destructive data-[invalid]:text-destructive data-[placeholder]:text-muted-foreground/70 data-[type=literal]:text-muted-foreground/70 data-[disabled]:opacity-50"
            />
          )}
        </DateInput>
      </div>
      <span className="text-accent-foreground/50 text-sm">{description}</span>
    </TimeField>
  );
}
