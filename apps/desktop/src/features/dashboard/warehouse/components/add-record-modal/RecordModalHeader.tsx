import { Button, ModalHeader } from "@heroui/react";
import { IoClose } from "react-icons/io5";
import { TbWriting } from "react-icons/tb";

const RecordModalHeader = ({ onClose }: { onClose: () => void }) => {
  return (
    <ModalHeader className=" justify-between items-center border-[#E2E8F0]">
      <div className="flex gap-2 items-center text-default-700">
        <div className="bg-primary/10 p-2.5 rounded-lg">
          <TbWriting className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-bold text-xl">Record Inventory Usage</p>
          <p className="text-xs">
            Update stock levels for your restaurant warehouse
          </p>
        </div>
      </div>
      <Button isIconOnly variant="light" onPress={onClose}>
        <IoClose size={30} className="text-[#64748B]" />
      </Button>
    </ModalHeader>
  );
};

export default RecordModalHeader;
