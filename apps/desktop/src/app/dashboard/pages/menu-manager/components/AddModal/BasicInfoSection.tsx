import { memo, useRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input, Textarea, Button } from "@heroui/react";
import { BiCloudUpload, BiTrash } from "react-icons/bi";
import { useAddMenuItemModalStore } from "../../stores/useAddMenuItemModalStore";
import { SHARED_INPUT_CLASS_NAMES } from "../../constants/SharedInputStyle";
import type { AddMenuItemFormData } from "../../types/types";

function BasicInfoSectionInner() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { control, setValue, watch } = useFormContext<AddMenuItemFormData>();
  const imageData = watch("imageData");
  const isDragging = useAddMenuItemModalStore((s) => s.isDragging);
  const setDragging = useAddMenuItemModalStore((s) => s.setDragging);

  const handleFile = (file: File) => {
    if (file?.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setValue("imageData", reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const removeImage = () => {
    setValue("imageData", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <section className="mb-10">
      <h3 className="text-[12px] font-bold text-[#64748B] tracking-widest uppercase pb-4">
        Basic Information
      </h3>
      <div className="space-y-6">
        <Controller
          name="itemName"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Item Name"
              labelPlacement="outside"
              placeholder="e.g. Classic Wagyu Burger"
              classNames={SHARED_INPUT_CLASS_NAMES}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label="Description"
              labelPlacement="outside"
              placeholder="Describe the ingredients..."
              minRows={3}
              classNames={SHARED_INPUT_CLASS_NAMES}
            />
          )}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#334155]">
            Item Image
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`relative border-2 mt-1 bg-white border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer 
              ${isDragging ? "border-blue-500 bg-blue-50" : "border-[#CBD5E1] bg-slate-50/30"} 
              ${imageData ? "border-solid " : "hover:bg-slate-50"}`}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) =>
                e.target.files?.[0] && handleFile(e.target.files[0])
              }
            />
            {imageData ? (
              <div
                className="relative group"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={imageData}
                  alt="Preview"
                  className="max-h-52 rounded-xl object-cover shadow-sm"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                  <Button
                    isIconOnly
                    color="danger"
                    variant="flat"
                    className="bg-white/90"
                    onPress={removeImage}
                  >
                    <BiTrash size={20} />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-[#F1F5F9] p-3 rounded-full shadow-sm mb-3 text-[#64768B]">
                  <BiCloudUpload size={28} />
                </div>
                <p className="text-sm font-semibold text-[#0F172A]">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-[#64748B] mt-1">
                  PNG, JPG or WEBP (max. 5MB)
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const BasicInfoSection = memo(BasicInfoSectionInner);
export default BasicInfoSection;
