import { Button } from "@heroui/react";
import { useState } from "react";
import { BiPlus } from "react-icons/bi";
import AddMenuItemModal from "./AddModal";
import Header from "@/features/dashboard/components/shared/header";
import { Link } from "react-router-dom";

function MenuManagerHeader() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Header
      title="Menu Manager"
      description="Manage your restaurant menu items and categories."
      action={
        <>
          <div className="flex gap-4">
            <Button
              as={Link}
              to="/dashboard/menu-manager/bulk-upload-menu-items"
              className="bg-white font-semibold rounded-2xl px-3 text-primary shadow-[0_2px_20px_rgba(0,0,0,0.1)] py-5"
            >
              <BiPlus className="w-5 h-5" /> Bulk Upload Menu Items
            </Button>
            <Button
              onPress={() => setIsOpen(true)}
              className="bg-primary font-semibold rounded-2xl px-3 text-white py-5"
            >
              <BiPlus className="w-5 h-5" /> New Menu Item
            </Button>
          </div>
          <AddMenuItemModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
      }
    />
  );
}

export default MenuManagerHeader;
