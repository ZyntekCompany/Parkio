import { Suspense } from "react";

import { DailyEarnings } from "@/components/dashboard/daily-earnings";
import { ParkingFees } from "@/components/dashboard/parking-fees";
import { WelcomeMessage } from "@/components/dashboard/welcome-message";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";
import { FeesSelectorSkeleton } from "@/components/skeletons/fees-selector-skeleton";

export default function Dashboard() {
  return (
    <div className="space-y-6 xs:p-4">
      <WelcomeMessage />
      <Suspense fallback={<DashboardSkeleton />}>
        <DailyEarnings />
      </Suspense>
      <Suspense fallback={<FeesSelectorSkeleton />}>
        <ParkingFees />
      </Suspense>
    </div>
  );
}
