import { Button } from "@heroui/react";
import Header from "../../components/shared/header";
import { PiExportBold } from "react-icons/pi";

const WarehouseHeader = () => {
  return (
    <Header
      title="Warehouse Overview"
      description="Live inventory monitoring and stock movement tracking."
      action={
        <div className="flex items-center gap-4">
          <Button startContent={<PiExportBold />}>Export Report</Button>
          <Button>Export</Button>
        </div>
      }
    />
  );
};

export default WarehouseHeader;
