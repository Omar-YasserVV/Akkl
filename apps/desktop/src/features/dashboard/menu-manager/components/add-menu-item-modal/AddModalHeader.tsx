import { Button, ModalHeader } from "@heroui/react";
import { FaUtensils } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

function AddModalHeader({ onClose }: { onClose: () => void }) {
  return (
    <ModalHeader className=" justify-between items-center border-[#E2E8F0]">
      <div className="flex gap-2 items-center text-default-700">
        <div className="bg-primary/10 p-2.5 rounded-lg">
          <FaUtensils className="w-5 h-5 text-primary" />
        </div>
        <span className="font-bold text-xl">Add New Menu Item</span>
      </div>
      <Button isIconOnly variant="light" onPress={onClose}>
        <IoClose size={30} className="text-[#64748B]" />
      </Button>
    </ModalHeader>
  );
}

export default AddModalHeader;
