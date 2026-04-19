import { Input, Select, SelectItem } from "@heroui/react";
import { OrderState } from "@repo/types";
import { statusOptions } from "../../constants/createOrderModal.constants";
import { CreateOrderDraft } from "../../types/OrderList.types";

type OrderInfoFieldsProps = {
  draft: CreateOrderDraft;
  onFieldChange: <K extends keyof CreateOrderDraft>(
    field: K,
    value: CreateOrderDraft[K],
  ) => void;
};

const fieldClassNames = {
  label: "font-semibold text-gray-700 mb-1",
};

const OrderInfoFields = ({ draft, onFieldChange }: OrderInfoFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
      <Input
        label="Customer Name *"
        placeholder="John Doe"
        value={draft.CustomerName}
        onValueChange={(value) => onFieldChange("CustomerName", value)}
        labelPlacement="outside"
        classNames={{
          ...fieldClassNames,
          inputWrapper: "bg-white border border-gray-200 h-12 shadow-none",
        }}
      />

      <Select
        label="Status *"
        placeholder="Select Status"
        selectedKeys={[draft.status]}
        onSelectionChange={(keys) =>
          onFieldChange("status", Array.from(keys)[0] as OrderState)
        }
        labelPlacement="outside"
        classNames={{
          ...fieldClassNames,
          trigger: "bg-white border border-gray-200 h-12 shadow-none",
        }}
      >
        {statusOptions.map((option) => (
          <SelectItem key={option.key}>{option.label}</SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default OrderInfoFields;
