import { useFormContext } from "react-hook-form";
import { AddMenuItemFormData } from "../AddMenuItemModal";
import { Button } from "@heroui/react";
import { BiTrash } from "react-icons/bi";

export default function SizeRow({
  index,
  watch,
  onRemove,
}: {
  index: number;
  watch: ReturnType<typeof useFormContext<AddMenuItemFormData>>["watch"];
  onRemove: () => void;
}) {
  const size = watch(`sizes.${index}`);

  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-[#E2E8F0] rounded-sm shadow-xs">
      <span className="flex-1 text-[#1E293B] font-medium text-sm">
        {size?.name ?? ""}
      </span>
      <div className="flex items-center gap-7">
        <div className="flex gap-1">
          <span className="text-[#94A3B8] text-sm">$</span>
          <span className="text-[#1E293B] text-sm font-medium">
            {size?.price ?? ""}
          </span>
        </div>
        <Button
          isIconOnly
          variant="light"
          size="sm"
          className="text-[#94A3B8] hover:text-danger"
          onPress={onRemove}
        >
          <BiTrash size={18} />
        </Button>
      </div>
    </div>
  );
}
