import { Button } from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import { daysFilter } from "../constants/line-chart-constants";
import Header from "@/features/dashboard/components/shared/header";

const FinanceHeader = () => {
  return (
    <Header
      title="Finance & Reports"
      description="Track revenue, expenses, and profitability."
      right={
        <div className="flex justify-end items-end gap-4">
          <Select
            className="w-36 text-center bg-white rounded-md"
            items={daysFilter}
            defaultSelectedKeys={["day"]}
            variant="bordered"
            radius="md"
            disallowEmptySelection
            classNames={{
              trigger: "border-1 border-default-200 shadow-none h-10 px-4",
              value: "text-default-700 font-normal",
            }}
          >
            {daysFilter.map((filter) => (
              <SelectItem key={filter.key}>{filter.label}</SelectItem>
            ))}
          </Select>
          <Button className="bg-primary rounded-md text-center px-4 text-md text-white py-3">
            Export as PDF
          </Button>
        </div>
      }
    />
  );
};

export default FinanceHeader;
