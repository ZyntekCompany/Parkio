import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RoundedUserAvatar } from "./rounded-user-avatar";

interface UserAvatarDialogProps {
  imageSrc?: string;
  className?: string;
  size?: "md" | "lg" | "xl" | "xxl";
}

export function UserAvatarDialog({
  className,
  imageSrc,
  size = "xl",
}: UserAvatarDialogProps) {
  return (
    <Dialog>
      <DialogTrigger className="w-fit rounded-full select-none">
        <RoundedUserAvatar src={imageSrc} className={className} size={size} />
      </DialogTrigger>
      <DialogContent
        aria-describedby="profile image"
        className="flex items-center justify-center size-0"
      >
        <RoundedUserAvatar src={imageSrc} size="xxl" />
        <DialogTitle aria-readonly className="hidden"></DialogTitle>
        <DialogDescription aria-readonly className="hidden"></DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
