import { Select, SelectItem } from "@heroui/react";
import { OrderState } from "@repo/types";
import { LuChefHat, LuCircleCheck, LuClock8, LuX } from "react-icons/lu";

export const StatusSelect = ({
  status,
  onChange,
}: {
  status: OrderState;
  onChange: (status: OrderState) => void;
}) => {
  const statusConfig = {
    [OrderState.PENDING]: {
      label: "Pending",
      color: "status-pill-pending",
      icon: LuClock8,
      itemClass: "text-amber-700 data-[hover=true]:bg-amber-50",
    },
    [OrderState.IN_PROGRESS]: {
      label: "Cooking",
      color: "status-pill-cooking",
      icon: LuChefHat,
      itemClass: "text-orange-900 data-[hover=true]:bg-orange-50",
    },
    [OrderState.COMPLETED]: {
      label: "Ready",
      color: "status-pill-ready",
      icon: LuCircleCheck,
      itemClass: "text-green-800 data-[hover=true]:bg-green-50",
    },
    [OrderState.CANCELLED]: {
      label: "Cancelled",
      color: "status-pill-cancelled",
      icon: LuX,
      itemClass: "text-red-700 data-[hover=true]:bg-red-50",
    },
  } as const;

  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  const currentClass = cfg.color;

  return (
    <Select
      aria-label="Change status"
      selectedKeys={[status]}
      onSelectionChange={(keys) => {
        const val = Array.from(keys)[0] as OrderState;
        if (val) onChange(val);
      }}
      variant="flat"
      radius="full"
      size="sm"
      disallowEmptySelection
      classNames={{
        trigger: `${currentClass} w-fit min-w-[120px] h-7 min-h-7 px-3 shadow-none border-none transition-none overflow-hidden`,
        value: "text-xs font-medium text-inherit!",
        selectorIcon: "text-inherit! h-3 w-3",
        popoverContent: "min-w-[130px] p-1",
      }}
      renderValue={() => (
        <div className="flex items-center gap-2 text-inherit!">
          <Icon className="h-4 w-4 text-inherit!" />
          <span className="text-inherit!">{cfg.label}</span>
        </div>
      )}
    >
      {(Object.values(OrderState) as OrderState[]).map((state) => {
        const { label, icon: StateIcon, itemClass } = statusConfig[state];
        return (
          <SelectItem
            key={state}
            textValue={label}
            startContent={<StateIcon className="h-4 w-4" />}
            className={itemClass}
          >
            {label}
          </SelectItem>
        );
      })}
    </Select>
  );
};
