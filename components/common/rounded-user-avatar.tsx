import { User } from "lucide-react";

import { currentUser } from "@/lib/auth-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const avatarSizes = cva("", {
  variants: {
    size: {
      default: "size-10",
      md: "size-12",
      lg: "size-[68px]",
      xl: "md:size-[120px] size-[80px]",
      xxl: "md:size-[340px] size-72",
    },
  },
});

interface RoundedUserAvatarProps extends VariantProps<typeof avatarSizes> {
  src?: string;
  own?: boolean;
  className?: string;
  fallbackClassName?: string;
}

export async function RoundedUserAvatar({
  src,
  own,
  className,
  fallbackClassName,
  size,
}: RoundedUserAvatarProps) {
  const loggedUser = await currentUser();

  const initials = loggedUser
    ?.name!.split(" ")
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

  return (
    <Avatar className={cn("size-9", className, avatarSizes({ size }))}>
      <AvatarImage
        src={own ? loggedUser?.image ?? "" : src}
        alt="User image"
        className="object-cover"
      />
      <AvatarFallback
        className={cn(
          "text-4xl font-bold bg-gradient-to-r dark:from-stone-500 dark:to-stone-700 from-neutral-300 to-stone-400",
          size === "xxl" && "text-6xl"
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
