import { Select, SelectItem } from "@heroui/react";
import Chip from "@repo/ui/components/chip";
import { Order } from "../types/LiveOrders.types";

export const StatusSelect = ({
  status,
  onChange,
  isLoading,
}: {
  status: Order["status"];
  onChange: (status: Order["status"]) => void;
  isLoading?: boolean;
}) => {
  return (
    <Select
      aria-label="Change status"
      selectedKeys={[status]}
      onSelectionChange={(keys) => {
        const val = Array.from(keys)[0] as Order["status"];
        if (val) onChange(val);
      }}
      variant="flat"
      className="max-w-[140px]"
      isDisabled={isLoading}
      classNames={{
        trigger:
          "bg-transparent shadow-none border-none p-0 min-h-fit h-auto w-fit data-[hover=true]:bg-transparent",
        popoverContent: "min-w-[130px] p-1",
        value: "p-0",
        innerWrapper: "w-fit px-2",
      }}
      renderValue={() => (
        <Chip
          className={`min-w-[110px] text-center ${isLoading ? "opacity-50" : ""}`}
          value={status}
        />
      )}
    >
      <SelectItem key="PENDING" textValue="Pending" className="text-orange-400">
        Pending
      </SelectItem>
      <SelectItem
        key="IN_PROGRESS"
        textValue="In Progress"
        className="text-primary"
      >
        In Progress
      </SelectItem>
      <SelectItem
        key="COMPLETED"
        textValue="Completed"
        className="text-success"
      >
        Completed
      </SelectItem>
      <SelectItem
        key="CANCELLED"
        textValue="Cancelled"
        className="text-red-500"
      >
        Cancelled
      </SelectItem>
    </Select>
  );
};