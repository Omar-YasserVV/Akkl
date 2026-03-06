import { Card, CardBody, Link } from "@heroui/react";
import { HiOutlinePlay, HiOutlineSupport } from "react-icons/hi";

const BulkUploadMenuItemsHelp = () => {
  return (
    <Card className="border border-[#144BB833] shadow-sm bg-[#144BB80D]">
      <CardBody className="p-5 flex flex-col gap-1">
        <h3 className="text-primary font-bold text-sm uppercase tracking-wider">
          Need Help?
        </h3>

        <p className="text-[#334155] text-[13px]">
          Struggling with the formatting? Watch our quick video guide or contact
          support.
        </p>

        <div className="flex flex-col gap-3 mt-2">
          <Link
            href="#"
            className="flex items-center gap-2 text-primary font-semibold text-sm hover:opacity-80 transition-opacity"
          >
            {/* Updated Icon Here */}
            <HiOutlinePlay className="w-5 h-5" />
            Video Tutorial
          </Link>

          <Link
            href="#"
            className="flex items-center gap-2 text-primary font-semibold text-sm hover:opacity-80 transition-opacity"
          >
            <HiOutlineSupport className="h-5 w-5" />
            Contact Support
          </Link>
        </div>
      </CardBody>
    </Card>
  );
};

export default BulkUploadMenuItemsHelp;
