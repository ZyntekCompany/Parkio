import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { profileTabs } from "@/constants";
import { ChangePassword } from "./change-password";
import { ScheduleTable } from "./schedule-table";
import { currentRole } from "@/lib/auth-user";
import { cn } from "@/lib/utils";
import { GeneralInfo } from "./general-info";
import { getCurrentEmployee } from "@/actions/common";

export async function ProfileTabs() {
  const role = await currentRole();
  const employee = await getCurrentEmployee();

  const isSuperAdmin = role === "SuperAdmin";

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="w-full justify-start gap-2 bg-transparent p-0 mb-6">
        {profileTabs.map(({ label, value }) => (
          <TabsTrigger
            key={label}
            value={value}
            className={cn(
              "rounded-full data-[state=active]:bg-accent-foreground/20 dark:data-[state=active]:bg-accent-foreground/30",
              isSuperAdmin && value === "schedule" && "hidden"
            )}
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="general">
        <GeneralInfo user={employee!} />
      </TabsContent>
      <TabsContent value="password">
        <ChangePassword />
      </TabsContent>
      {!isSuperAdmin && (
        <TabsContent value="schedule">
          <ScheduleTable />
        </TabsContent>
      )}
    </Tabs>
  );
}
