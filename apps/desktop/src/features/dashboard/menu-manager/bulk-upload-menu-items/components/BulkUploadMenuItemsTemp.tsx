import { Card, CardBody, Button } from "@heroui/react";
import { HiOutlineDocumentText, HiOutlineDownload } from "react-icons/hi";
import { RiFileExcel2Line } from "react-icons/ri";

const BulkUploadMenuItemsTemp = () => {
  return (
    <Card className="border-none shadow-sm bg-white p-2 py-4">
      <CardBody className="flex flex-row items-center justify-between gap-5">
        {/* Left Section: Icon and Text */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl">
            <HiOutlineDocumentText className="text-primary text-3xl" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-primary font-bold text-lg">
              1. Download Template
            </h3>
            <p className="text-muted-foreground text-sm">
              Use our standard format to ensure your data imports perfectly.
            </p>
          </div>
        </div>

        {/* Right Section: Buttons */}
        <div className="flex items-center gap-3">
          <Button
            color="primary"
            variant="solid"
            startContent={<HiOutlineDownload size={18} />}
            className="font-semibold px-3 text-sm bg-primary rounded-md"
          >
            CSV Template
          </Button>
          <Button
            variant="flat"
            startContent={<RiFileExcel2Line size={18} />}
            className="bg-slate-50 text-slate-700 font-semibold border border-slate-100"
          >
            Excel
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default BulkUploadMenuItemsTemp;
