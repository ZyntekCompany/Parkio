import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface UserAvatarProps {
  src: string;
  userName: string;
}

export default function UserAvatar({ src, userName }: UserAvatarProps) {
  const initials = userName
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

  return (
    <Avatar className="h-8 w-8 rounded-lg">
      <AvatarImage src={src} alt={userName} />
      <AvatarFallback className="rounded-lg bg-gradient-to-r dark:from-stone-500 dark:to-stone-700 from-neutral-300 to-stone-400">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
