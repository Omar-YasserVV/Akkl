import Header from "@/features/dashboard/components/shared/header";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { BiChevronDown } from "react-icons/bi";
import { AnalyticsDaysAgo } from "../../overview/types/analytics";
import { useAnalyticsStore } from "../store/finance";

const FinanceHeader = () => {
  const ranges: { label: string; value: AnalyticsDaysAgo }[] = [
    { label: "Last 7 days", value: 7 },
    { label: "Last 14 days", value: 14 },
    { label: "Last 30 days", value: 30 },
    { label: "Last 60 days", value: 60 },
    { label: "Last 90 days", value: 90 },
    { label: "Last 120 days", value: 120 },
  ];

  const daysAgo = useAnalyticsStore((state) => state.daysAgo);
  const setDaysAgo = useAnalyticsStore((state) => state.setDaysAgo);

  const selectedLabel =
    ranges.find((range) => range.value === daysAgo)?.label || "Select Range";

  return (
    <Header
      title="Finance & Reports"
      description="Track revenue, expenses, and profitability."
      right={
        <div className="flex justify-end items-end gap-4">
          <Dropdown>
            <DropdownTrigger ger>
              <Button
                endContent={<BiChevronDown />}
                variant="bordered"
                className="bg-white"
              >
                {selectedLabel}
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Select date range">
              {ranges.map((range) => (
                <DropdownItem
                  key={range.value}
                  onClick={() => setDaysAgo(range.value)}
                  color={range.value === daysAgo ? "primary" : undefined}
                >
                  {range.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          {/* <Button className="bg-primary rounded-md text-center px-4 text-md text-white py-3">
            Export as PDF
          </Button> */}
        </div>
      }
    />
  );
};

export default FinanceHeader;
