import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileHeaderSkeleton() {
  return (
    <div className="flex items-center gap-4 bg-zinc-950 p-4">
      {/* Avatar skeleton */}
      <Skeleton className="h-16 w-16 rounded-full bg-zinc-800" />

      {/* Text content */}
      <div className="flex flex-col gap-2">
        {/* Name skeleton */}
        <Skeleton className="h-7 w-48 bg-zinc-800" />

        {/* Email skeleton */}
        <Skeleton className="h-5 w-36 bg-zinc-800/50" />
      </div>
    </div>
  );
}
