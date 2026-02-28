import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { BiChevronDown } from "react-icons/bi";

const OverviewHeader = () => {
  const ranges = [
    { label: "last 30 days", value: "last_30_days" },
    { label: "last 60 days", value: "last_60_days" },
    { label: "last 90 days", value: "last_90_days" },
    { label: "last 120 days", value: "last_120_days" },
    // { label: "Custom Range", value: "custom_range" },
  ];
  return (
    <div className="flex justify-between items-end">
      <div className="space-y-2.5">
        <h2 className="font-cherry text-primary text-5xl">Overview</h2>
        <p className="text-muted-foreground">
          Manage orders from app and restaurant in real-time.
        </p>
      </div>
      <Dropdown>
        <DropdownTrigger>
          <Button
            endContent={<BiChevronDown />}
            variant="bordered"
            className="bg-white"
          >
            Open Menu
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          {ranges.map((range) => (
            <DropdownItem key={range.value}>{range.label}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default OverviewHeader;
