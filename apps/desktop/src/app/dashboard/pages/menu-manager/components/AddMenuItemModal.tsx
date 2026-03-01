import React, { useState, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  Input,
  Textarea,
  Switch,
  Chip,
} from "@heroui/react";
import { BiPlus, BiCloudUpload, BiTrash, BiX } from "react-icons/bi";
import { LuFlame } from "react-icons/lu";
import AddModalHeader from "./AddModal/AddModalHeader";
import AddModalFooter from "./AddModal/AddModalFooter";

interface ItemOption {
  id: string;
  name: string;
  price: string;
}

export default function AddMenuItemModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // --- State Management ---
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sizes, setSizes] = useState<ItemOption[]>([
    { id: "1", name: "Standard", price: "12.99" },
  ]);
  const [addOns, setAddOns] = useState<ItemOption[]>([
    { id: "1", name: "Extra Cheese", price: "2.00" },
    { id: "2", name: "Bacon Strips", price: "3.50" },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Image Upload & Drag/Drop Logic ---
  const handleFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const removeImage = (e: React.MouseEvent | any) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const deleteSize = (id: string) => setSizes(sizes.filter((s) => s.id !== id));
  const deleteAddOn = (id: string) =>
    setAddOns(addOns.filter((a) => a.id !== id));

  const sharedInputClassNames = {
    inputWrapper: [
      "rounded-[8px] border-1 border-[#CBD5E1] bg-white transition-all shadow-sm",
      "group-data-[focus=true]:border-[oklch(0.6_0.201_252.89)]",
      "group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-[oklch(0.6_0.201_252.89)]",
    ],
    input: "placeholder:text-[#6B7280] text-[#1E293B] text-[16px]",
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="3xl"
      scrollBehavior="inside"
      closeButton={<BiX className="text-2xl" />}
      classNames={{
        base: "max-h-[95vh] rounded-[20px]",
        header: "border-b py-4",
        footer: "border-t py-4 bg-white",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <AddModalHeader />

            <ModalBody className="py-6 px-8 bg-[#fafafa]">
              {/* BASIC INFO */}
              <section className="mb-10">
                <h3 className="text-[12px] font-bold text-[#64748B] tracking-widest uppercase mb-5">
                  Basic Information
                </h3>
                <div className="space-y-6">
                  <Input
                    label="Item Name"
                    labelPlacement="outside"
                    placeholder="e.g. Classic Wagyu Burger"
                    classNames={sharedInputClassNames}
                  />
                  <Textarea
                    label="Description"
                    labelPlacement="outside"
                    placeholder="Describe the ingredients..."
                    minRows={3}
                    classNames={sharedInputClassNames}
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
                        ${imagePreview ? "border-solid " : "hover:bg-slate-50"}`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) =>
                          e.target.files && handleFile(e.target.files[0])
                        }
                      />
                      {imagePreview ? (
                        <div className="relative group">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-h-52 rounded-xl object-cover shadow-sm"
                          />
                          <div className="absolute inset-0 bg-black/40  opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                            <Button
                              isIconOnly
                              color="danger"
                              variant="flat"
                              className="bg-white/90"
                              onPress={(e) => removeImage(e)}
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

              {/* VARIATIONS */}
              <section className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[12px] font-bold text-[#64748B] tracking-widest uppercase">
                    Variations & Sizes
                  </h3>
                  <Button
                    size="sm"
                    variant="light"
                    color="primary"
                    startContent={<BiPlus />}
                    className="font-bold"
                  >
                    Add Size
                  </Button>
                </div>
                <div className="space-y-3">
                  {sizes.map((size) => (
                    <div
                      key={size.id}
                      className="flex items-center gap-4 p-4 bg-white border border-[#E2E8F0] rounded-xl shadow-sm"
                    >
                      <span className="flex-1 text-[#1E293B] font-semibold text-sm">
                        {size.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-[#94A3B8] text-sm">$</span>
                        <span className="text-[#1E293B] font-bold">
                          {size.price}
                        </span>
                        <Button
                          isIconOnly
                          variant="light"
                          size="sm"
                          className="text-[#CBD5E1] hover:text-danger"
                          onPress={() => deleteSize(size.id)}
                        >
                          <BiTrash size={18} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* MODIFIERS */}
              <section className="mb-10">
                <h3 className="text-[12px] font-bold text-[#64748B] tracking-widest uppercase mb-4">
                  Modifier Groups
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-semibold text-[#334155]">
                        Add-ons
                      </label>
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        className="h-7 text-[11px] font-bold"
                      >
                        Add Option
                      </Button>
                    </div>
                    <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
                      {addOns.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center p-3.5 border-b last:border-0 border-[#F1F5F9] group"
                        >
                          <span className="text-sm text-[#475569]">
                            {item.name}{" "}
                            <span className="text-[#94A3B8] ml-2">
                              +${item.price}
                            </span>
                          </span>
                          <button
                            onClick={() => deleteAddOn(item.id)}
                            className="opacity-0 group-hover:opacity-100 text-danger transition-opacity"
                          >
                            <BiTrash size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-semibold text-[#334155]">
                        Choices (Sauce)
                      </label>
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        className="h-7 text-[11px] font-bold"
                      >
                        Add Option
                      </Button>
                    </div>
                    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm">
                      <div className="flex justify-between items-center p-3.5 border-b border-[#F1F5F9]">
                        <span className="text-sm text-[#475569]">
                          BBQ Sauce
                        </span>
                        <div className="w-5 h-5 rounded-full border-2 border-[#2563EB] flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3.5">
                        <span className="text-sm text-[#475569]">
                          Spicy Mayo
                        </span>
                        <div className="w-5 h-5 rounded-full border-2 border-[#E2E8F0]" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* DIETARY & AVAILABILITY */}
              <div className="grid grid-cols-2 gap-10">
                <section className="space-y-8">
                  <div>
                    <h3 className="text-[12px] font-bold text-[#64748B] tracking-widest uppercase mb-4">
                      Dietary Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Chip
                        color="primary"
                        variant="solid"
                        className="px-2 font-semibold"
                      >
                        Vegan
                      </Chip>
                      <Chip
                        variant="bordered"
                        className="border-[#E2E8F0] text-[#64748B] bg-white font-medium"
                      >
                        Gluten-Free
                      </Chip>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#334155] mb-4">
                      Spiciness Level
                    </h3>
                    <div className="flex gap-8">
                      <div className="flex flex-col items-center">
                        <div className="flex text-[#EF4444] text-xl gap-0.5">
                          <LuFlame />
                          <LuFlame />
                        </div>
                        <span className="text-[10px] font-bold text-[#1E293B] uppercase mt-1.5">
                          Hot
                        </span>
                      </div>
                    </div>
                  </div>
                </section>
                <section>
                  <h3 className="text-[12px] font-bold text-[#64748B] tracking-widest uppercase mb-4">
                    Availability
                  </h3>
                  <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-6 shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#1E293B]">
                          In-Stock
                        </span>
                        <span className="text-[11px] text-[#94A3B8]">
                          Available for ordering now
                        </span>
                      </div>
                      <Switch defaultSelected color="primary" size="sm" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#1E293B]">
                          Visible on App
                        </span>
                        <span className="text-[11px] text-[#94A3B8]">
                          Customers can browse this item
                        </span>
                      </div>
                      <Switch defaultSelected color="primary" size="sm" />
                    </div>
                  </div>
                </section>
              </div>
            </ModalBody>
            <AddModalFooter onClose={onClose} />
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
