import { useFormContext } from "react-hook-form";
import { AddMenuItemFormData } from "../AddMenuItemModal";
import { BiTrash } from "react-icons/bi";

export default function AddOnRow({
  index,
  watch,
  onRemove,
}: {
  index: number;
  watch: ReturnType<typeof useFormContext<AddMenuItemFormData>>["watch"];
  onRemove: () => void;
}) {
  const item = watch(`addOns.${index}`);

  return (
    <div className="flex justify-between items-center p-3.5 border-b last:border-0 border-[#F1F5F9] group">
      <span className="text-sm text-[#475569]">{item?.name ?? ""}</span>

      <div className="relative flex items-center ">
        <div className="flex items-center gap-2 transition-transform duration-300 ease-in-out transform group-hover:-translate-x-7">
          <span className="text-[#64748B] font-semibold text-sm whitespace-nowrap">
            +${item?.price ?? ""}
          </span>

          <button
            type="button"
            onClick={onRemove}
            className="absolute left-full ml-2 opacity-0 group-hover:opacity-100 text-red-500 transition-all duration-300 p-0.5 cursor-pointer"
            aria-label="Remove"
          >
            <BiTrash size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
