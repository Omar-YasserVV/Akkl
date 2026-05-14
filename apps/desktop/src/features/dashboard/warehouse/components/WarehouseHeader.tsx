import { Button } from "@heroui/react";
import { useState } from "react";
import { PiExportBold } from "react-icons/pi";
import { TbWriting } from "react-icons/tb";
import Header from "../../components/shared/header";
import AddRecordModal from "./add-record-modal";

interface WarehouseHeaderProps {
  warehouseName?: string;
}

const WarehouseHeader = ({ warehouseName }: WarehouseHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  return (
    <>
      <Header
        title={
          warehouseName ? `Warehouse — ${warehouseName}` : "Warehouse Overview"
        }
        description="Live inventory monitoring and stock movement tracking."
        right={
          <div className="flex justify-end items-end gap-2.5">
            <Button
              size="lg"
              className="text-primary bg-white text-xl font-medium px-3"
              startContent={<PiExportBold />}
            >
              Export Report
            </Button>

            <Button
              className="bg-primary text-white text-xl font-medium px-3"
              size="lg"
              startContent={<TbWriting />}
              onPress={() => setIsOpen(true)}
            >
              Stock actions
            </Button>
          </div>
        }
      />
      <AddRecordModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default WarehouseHeader;
