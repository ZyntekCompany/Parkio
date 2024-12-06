import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectableCardProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: (id: string) => void;
}

export const SelectableCard = ({
  id,
  name,
  checked,
  onChange,
}: SelectableCardProps) => {
  const checkAnimation = {
    initial: { scale: 0 },
    animate: { scale: 1 },
    exit: { scale: 0 },
  };

  return (
    <label
      className={cn(
        "flex-1 min-w-[150px] relative px-5 py-2.5 rounded-lg border border-accent-foreground/30 dark:border-accent bg-muted-foreground/10 text-card-foreground shadow-sm cursor-pointer transition-colors",
        checked
          ? "border-blue-600 dark:border-blue-600 bg-primary/15"
          : "hover:border-blue-600 dark:hover:border-blue-600"
      )}
    >
      <input
        type="checkbox"
        value={id}
        checked={checked}
        onChange={() => onChange(id)}
        className="hidden"
      />
      <AnimatePresence>
        {checked && (
          <motion.div
            className="flex items-center justify-center absolute top-2 right-2 p-1 rounded-full bg-blue-600"
            {...checkAnimation}
          >
            <Check
              className="size-3 text-primary text-white shrink-0"
              strokeWidth={3}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="select-none">{name}</span>
    </label>
  );
};
