import Image from "next/image";

import { Button } from "@/components/ui/button";

interface UserSelectButtonProps {
  userImage?: string | null;
  name: string;
}

export default function UserSelectButton({
  userImage,
  name,
}: UserSelectButtonProps) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

  return (
    <Button className="py-0 ps-0 cursor-default bg-transparent hover:bg-transparent text-accent-foreground">
      <div className="flex items-center aspect-square h-full px-2">
        {userImage && (
          <Image
            className="h-auto w-full rounded-full"
            src={userImage}
            alt="Profile image"
            width={24}
            height={24}
            aria-hidden="true"
          />
        )}
        {!userImage && (
          <div className="flex items-center justify-center text-accent-foreground rounded-full size-8 bg-gradient-to-r dark:from-stone-500 dark:to-stone-700 from-neutral-300 to-stone-400">
            {initials}
          </div>
        )}
      </div>
      {name}
    </Button>
  );
}
