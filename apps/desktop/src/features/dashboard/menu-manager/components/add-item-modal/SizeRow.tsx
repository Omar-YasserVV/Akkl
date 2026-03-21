import { useFormContext } from "react-hook-form";
import { AddMenuItemFormData } from "../../types/AddItem";
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
    <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-sm shadow-xs">
      <span className="flex-1 text-slate-800 font-medium text-sm">
        {size?.name ?? ""}
      </span>
      <div className="flex items-center gap-7">
        <div className="flex gap-1">
          <span className="text-slate-400 text-sm">$</span>
          <span className="text-slate-800 text-sm font-medium">
            {size?.price ?? ""}
          </span>
        </div>
        <Button
          isIconOnly
          variant="light"
          size="sm"
          className="text-slate-400 hover:text-danger"
          onPress={onRemove}
        >
          <BiTrash size={18} />
        </Button>
      </div>
    </div>
  );
}
