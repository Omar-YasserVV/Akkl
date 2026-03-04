import Header from "@/features/dashboard/components/shared/header";
import { BiChevronLeft } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

function BulkUploadMenuItemsHeader() {
  const navigate = useNavigate();

  return (
    <Header
      before={
        <button
          onClick={() => navigate(-1)}
          // Reduced mb-8 to mb-4 for a tighter, cleaner alignment
          className="p-2 bg-white rounded-xl mb-4 shadow-sm hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center"
        >
          <BiChevronLeft size={24} className="text-[#262626]" />
        </button>
      }
      title="Menu Manager"
      description="Manage your restaurant menu items and categories."
    />
  );
}

export default BulkUploadMenuItemsHeader;
