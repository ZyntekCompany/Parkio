import { UserAvatarDialog } from "@/components/common/user-avatar-dialog";
import { currentUser } from "@/lib/auth-user";

export async function ProfileHeader() {
  const loggedUser = await currentUser();

  return (
    <div className="flex items-center">
      <div className="flex max-xs:flex-col xs:items-center justify-center gap-5 md:gap-10 truncate">
        <UserAvatarDialog imageSrc={loggedUser?.image ?? ""} />
        <div className="my-1 space-y-4 truncate">
          <div className="">
            <h2 className="text-[22px] xs:text-2xl sm:text-[30px] font-bold truncate w-full">
              {loggedUser?.name}
            </h2>
            <p className="text-base text-gray-500 dark:text-gray-400 truncate w-full">
              {loggedUser?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
