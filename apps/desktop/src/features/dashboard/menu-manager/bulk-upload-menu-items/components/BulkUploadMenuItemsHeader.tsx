import Header from "@/features/dashboard/components/shared/header";
import { Button } from "@heroui/react";
import { BiChevronLeft, BiPlus } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

function BulkUploadMenuItemsHeader() {
  const navigate = useNavigate();

  return (
    <Header
      leftClassName="mb-3"
      left={
        <button
          onClick={() => navigate(-1)}
          // Reduced mb-8 to mb-4 for a tighter, cleaner alignment
          className="p-2 bg-white rounded-xl mb-4 shadow-sm hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center"
        >
          <BiChevronLeft size={24} className="text-[#262626]" />
        </button>
      }
      right={
        <>
          <div className="flex gap-4">
            <Button className="bg-white font-semibold rounded-2xl px-3 text-primary shadow-[0_2px_20px_rgba(0,0,0,0.1)] py-5">
              <BiPlus className="w-5 h-5" /> Bulk Upload Menu Items
            </Button>
            <Button
              onPress={() => {}}
              className="bg-primary font-semibold rounded-2xl px-3 text-white py-5"
            >
              <BiPlus className="w-5 h-5" /> New Menu Item
            </Button>
          </div>
        </>
      }
      title="Menu Manager"
      description="Manage your restaurant menu items and categories."
    />
  );
}

export default BulkUploadMenuItemsHeader;
