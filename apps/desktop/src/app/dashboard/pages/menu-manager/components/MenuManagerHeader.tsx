import { Button } from "@heroui/react";
import { Plus } from "lucide-react";

function MenuManagerHeader() {
  return (
    <header className="px-4 pt-6 pb-5 flex flex-col rounded-lg">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="cherry-bomb-one-regular text-primary text-5xl mb-2.5">
            Menu Manager{" "}
          </h2>
          <p className="text-[#808080]">
            Manage your restaurant menu items and categories.{" "}
          </p>
        </div>
        <div className="flex gap-4">
          <Button className="bg-white font-semibold rounded-2xl px-3 text-primary shadow-[0_2px_20px_rgba(0,0,0,0.1)] py-5">
            <Plus className="w-5 h-5" /> Bulk Upload Menu Items
          </Button>
          <Button className="bg-primary font-semibold rounded-2xl px-3 text-white py-5">
            <Plus className="w-5 h-5" /> New Order
          </Button>
        </div>
      </div>
    </header>
  );
}

export default MenuManagerHeader;
