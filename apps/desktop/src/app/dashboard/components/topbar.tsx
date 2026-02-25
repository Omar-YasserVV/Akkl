import { Avatar, Button, Divider, Input, Badge } from "@heroui/react";
import { Bell, Search, Globe } from "lucide-react";

const Topbar = () => {
  return (
    <div className="h-20 px-8 flex items-center justify-between bg-background/70 backdrop-blur-md sticky top-0 z-30">
      {/* Search Bar - refined width and styling */}
      <Input
        startContent={<Search size={18} className="text-default-400" />}
        placeholder="Search"
        className="max-w-[460px]"
        classNames={{
          inputWrapper: "bg-default-100",
        }}
      />

      <div className="flex items-center gap-4">
        {/* Language Switcher - replaced text with icon/label combo */}
        <Button
          variant="light"
          startContent={<Globe size={18} />}
          size="sm"
          className="text-default-600 font-medium"
        >
          EN
        </Button>

        {/* Notifications with Badge */}
        <Badge
          color="danger"
          content="5"
          shape="circle"
          size="sm"
          classNames={{ badge: "top-3 left-3" }}
        >
          <Button isIconOnly variant="light" radius="full" size="md">
            <Bell size={20} className="text-default-600" />
          </Button>
        </Badge>

        <Divider orientation="vertical" className="h-6 mx-1" />

        {/* User Profile Section */}
        <div className="flex items-center gap-3 pl-2 cursor-pointer hover:opacity-80 transition-opacity">
          <Avatar
            as="button"
            className="transition-transform"
            name="Admin"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
          <div className="flex flex-col items-end">
            <p className="text-sm font-semibold text-default-900">Admin User</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
