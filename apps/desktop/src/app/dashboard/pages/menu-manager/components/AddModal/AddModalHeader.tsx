import { ModalHeader } from "@heroui/react";
import { FaUtensils } from "react-icons/fa";

function AddModalHeader() {
  return (
    <ModalHeader className="flex gap-2 items-center text-[#1E293B] border-[#E2E8F0]">
      <div className="bg-[#144BB81A] p-2.5 rounded-lg">
        <FaUtensils className="w-5 h-5 text-primary" />
      </div>
      <span className="font-bold text-xl">Add New Menu Item</span>
    </ModalHeader>
  );
}

export default AddModalHeader;
