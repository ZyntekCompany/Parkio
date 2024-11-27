import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function Heading({ title, description, className }: HeaderProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-[16px] text-muted-foreground">{description}</p>
    </div>
  );
}
