import { useAuthStore } from "@/store/AuthStore";
import { Avatar } from "@heroui/react";

const Topbar = () => {
  const { user } = useAuthStore();
  return (
    <div className="h-20 px-8 flex items-center justify-end bg-background/70 backdrop-blur-md sticky top-0 z-30">
      {/* User Profile Section */}
      <div className="flex items-center gap-3 pl-2 cursor-pointer hover:opacity-80 transition-opacity">
        <Avatar
          as="button"
          className="transition-transform"
          name={user?.fullName}
          src={user?.image}
        />
        <div className="flex flex-col items-end">
          <p className="text-sm font-semibold text-default-900">
            {user?.fullName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
