import { Button, Input, Select, SelectItem } from "@heroui/react";
import { Controller, useFormContext } from "react-hook-form";
import { BiTrash } from "react-icons/bi";
import { SHARED_INPUT_CLASS_NAMES } from "../../constants/SharedInputStyle";
import { MENU_SIZE_OPTIONS } from "../../constants/formConfig";
import { AddMenuItemFormData, Size } from "../../types/AddItem";

export default function SizeRow({
  index,
  selectedSizes,
  onRemove,
}: {
  index: number;
  selectedSizes: (Size | "")[];
  onRemove: () => void;
}) {
  const { control } = useFormContext<AddMenuItemFormData>();

  return (
    <div className="flex flex-wrap items-end gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
      <Controller
        name={`sizes.${index}.name`}
        control={control}
        render={({ field }) => (
          <Select
            label="Size / label"
            labelPlacement="outside"
            placeholder="Choose size"
            selectedKeys={field.value ? [field.value] : []}
            disabledKeys={MENU_SIZE_OPTIONS.filter(
              (option) =>
                option.value !== field.value && selectedSizes.includes(option.value),
            ).map((option) => option.value)}
            onSelectionChange={(keys) => {
              if (keys === "all") return;
              const value = Array.from(keys)[0];
              field.onChange(typeof value === "string" ? value : "");
            }}
            className="min-w-[140px] flex-1"
            classNames={{
              trigger: SHARED_INPUT_CLASS_NAMES.inputWrapper.join(" "),
            }}
          >
            {MENU_SIZE_OPTIONS.map((option) => (
              <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
          </Select>
        )}
      />
      <Controller
        name={`sizes.${index}.price`}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Price"
            labelPlacement="outside"
            placeholder="0.00"
            startContent={<span className="text-slate-400 text-sm">$</span>}
            className="w-36"
            classNames={SHARED_INPUT_CLASS_NAMES}
          />
        )}
      />
      <Button
        isIconOnly
        variant="light"
        size="sm"
        className="text-slate-400 hover:text-danger mb-0.5"
        onPress={onRemove}
      >
        <BiTrash size={18} />
      </Button>
    </div>
  );
}
