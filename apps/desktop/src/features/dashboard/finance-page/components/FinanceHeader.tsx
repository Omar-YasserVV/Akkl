import Header from "@/features/dashboard/components/shared/header";
import { Button, Select, SelectItem } from "@heroui/react";
import { daysFilter } from "../constants/line-chart-constants";
import { useAnalyticsStore } from "../store/finance";

const numberToKeyMap: Record<number, string> = {
  1: "day",
  7: "week",
  30: "month",
};
const keyToNumberMap: Record<string, number> = {
  day: 1,
  week: 7,
  month: 30,
};

const FinanceHeader = () => {
  const daysAgo = useAnalyticsStore((state) => state.daysAgo);
  const setDaysAgo = useAnalyticsStore((state) => state.setDaysAgo);

  const selectedKey = numberToKeyMap[daysAgo] || "month";

  const handleSelectionChange = (keys: any) => {
    const currentKey = Array.from(keys)[0] as string;

    if (currentKey && keyToNumberMap[currentKey]) {
      setDaysAgo(keyToNumberMap[currentKey]);
    }
  };

  return (
    <Header
      title="Finance & Reports"
      description="Track revenue, expenses, and profitability."
      right={
        <div className="flex justify-end items-end gap-4">
          <Select
            className="w-36 text-center bg-white rounded-md"
            items={daysFilter}
            selectedKeys={[selectedKey]}
            onSelectionChange={handleSelectionChange}
            variant="bordered"
            radius="md"
            disallowEmptySelection
            classNames={{
              trigger: "border-1 border-default-200 shadow-none h-10 px-4",
              value: "text-default-700 font-normal",
            }}
          >
            {(filter) => (
              <SelectItem key={filter.key}>{filter.label}</SelectItem>
            )}
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
