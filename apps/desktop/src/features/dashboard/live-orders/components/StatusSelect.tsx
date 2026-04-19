import { Select, SelectItem } from "@heroui/react";
import { OrderState } from "@repo/types";
import clsx from "clsx";
import { statusConfig } from "../constants/statusConfig";

export const StatusSelect = ({
  status,
  onChange,
  isLoading,
}: {
  status: OrderState;
  isLoading: boolean;
  onChange: (status: OrderState) => void;
}) => {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  const currentClass = cfg.color;

  return (
    <Select
      isLoading={isLoading}
      disabled={isLoading}
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
        trigger: clsx(
          currentClass,
          "w-fit min-w-[120px] h-7 min-h-7 px-3 shadow-none border-none transition-none overflow-hidden",
          isLoading && "opacity-60 pointer-events-none",
        ),
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
