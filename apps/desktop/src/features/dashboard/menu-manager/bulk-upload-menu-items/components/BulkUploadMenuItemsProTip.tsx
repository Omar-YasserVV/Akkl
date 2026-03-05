import { Card, CardBody } from "@heroui/react";

const BulkUploadMenuItemsProTip = () => {
  return (
    <Card
      shadow="none"
      className="bg-primary text-white border-none overflow-hidden"
    >
      <CardBody className="p-6 flex flex-col gap-3">
        {/* Label */}
        <span className="text-blue-100 font-medium text-sm opacity-90">
          Pro Tip
        </span>

        {/* Content */}
        <h2 className="text-lg font-semibold leading-tight max-w-[90%]">
          Sync directly with POS to avoid manual uploads.
        </h2>
      </CardBody>
    </Card>
  );
};

export default BulkUploadMenuItemsProTip;
