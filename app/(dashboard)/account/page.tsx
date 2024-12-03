import { Suspense } from "react";
import { ProfileHeader } from "./components/profile-header";
import { ProfileTabs } from "./components/profile-tabs";
import ProfileHeaderSkeleton from "@/components/skeletons/profile-header-skeleton";

export default function AccountPage() {
  return (
    <div className="space-y-6 xs:p-4 overflow-hidden">
      <Suspense fallback={<ProfileHeaderSkeleton />}>
        <ProfileHeader />
      </Suspense>
      <ProfileTabs />
    </div>
  );
}
