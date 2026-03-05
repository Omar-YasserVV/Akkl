import { Card, CardBody } from "@heroui/react";
import {
  HiOutlineInformationCircle,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import { requirements } from "../constants/requirements";

const BulkUploadMenuItemsRequirment = () => {
  return (
    <Card className="border border-slate-100 shadow-sm bg-white">
      <CardBody className="p-5 flex flex-col gap-3">
        {/* Header section */}
        <div className="flex items-center gap-2">
          <HiOutlineInformationCircle className="text-primary text-2xl" />
          <h3 className="text-primary font-bold text-[16px]">Requirements</h3>
        </div>

        {/* Requirements List */}
        <div className="flex flex-col gap-2">
          {requirements.map((item, index) => (
            <div key={index} className="flex gap-3 items-start">
              <HiOutlineCheckCircle className="text-green-500 text-xl mt-0.5 shrink-0" />
              <div className="flex flex-col gap-0">
                <span className="text-primary font-bold text-base leading-tight">
                  {item.title}
                </span>
                <span className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Currency Note Section */}
        <div className="mt-1 p-2 bg-slate-50 rounded-md border border-slate-100">
          <p className="text-slate-500 text-[12px] text-center leading-relaxed">
            "Always ensure your currency format matches your workspace settings
            (currently USD)."
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

export default BulkUploadMenuItemsRequirment;
