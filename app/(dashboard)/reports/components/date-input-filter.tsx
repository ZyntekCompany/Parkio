"use client";

import { Input } from "@/components/ui/input";

interface DateInputFilterProps {
  disable: boolean;
  label: string;
  labelId: string;
  handleOnChange: (value: string) => void;
}

export function DateInputFilter({
  disable,
  label,
  labelId,
  handleOnChange,
}: DateInputFilterProps) {
  return (
    <div className="xs:flex-1 w-full">
      <Input
        disabled={disable}
        type="date"
        id={labelId}
        onChange={(e) => handleOnChange(e.target.value)}
      />
      <span className="text-sm text-accent-foreground/60 mt-1">{label}</span>
    </div>
  );
}
