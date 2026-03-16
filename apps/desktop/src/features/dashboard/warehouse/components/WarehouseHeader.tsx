import { Button } from "@heroui/react";
import Header from "../../components/shared/header";
import { PiExportBold } from "react-icons/pi";
import { TbWriting } from "react-icons/tb";

const WarehouseHeader = () => {
  return (
    <Header
      title="Warehouse Overview"
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
          >
            Record Usage
          </Button>
        </div>
      }
    />
  );
};

export default WarehouseHeader;
