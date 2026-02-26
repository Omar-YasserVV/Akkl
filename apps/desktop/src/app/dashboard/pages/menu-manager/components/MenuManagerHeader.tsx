import { Button } from "@heroui/react";
import { BiPlus } from "react-icons/bi";

function MenuManagerHeader() {
  return (
    <header className="flex flex-col rounded-lg">
      <div className="flex justify-between items-end">
        <div className="space-y-2.5">
          <h2 className="font-cherry text-primary text-5xl">Menu Manager</h2>
          <p className="text-muted-foreground">
            Manage your restaurant menu items and categories.{" "}
          </p>
        </div>
        <div className="flex gap-4">
          <Button className="bg-white font-semibold rounded-2xl px-3 text-primary shadow-[0_2px_20px_rgba(0,0,0,0.1)] py-5">
            <BiPlus className="w-5 h-5" /> Bulk Upload Menu Items
          </Button>
          <Button className="bg-primary font-semibold rounded-2xl px-3 text-white py-5">
            <BiPlus className="w-5 h-5" /> New Order
          </Button>
        </div>
      </div>
    </header>
  );
}

export default MenuManagerHeader;
