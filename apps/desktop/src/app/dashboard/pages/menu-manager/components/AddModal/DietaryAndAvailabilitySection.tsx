import { memo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Switch, Chip } from "@heroui/react";
import { LuFlame } from "react-icons/lu";
import type { AddMenuItemFormData, SpicinessLevel } from "../../types/types";
import {
  DIETARY_TAG_OPTIONS,
  SPICINESS_OPTIONS,
} from "../../constants/formConfig";

function DietaryAndAvailabilitySectionInner() {
  const { control, watch, setValue } = useFormContext<AddMenuItemFormData>();
  const dietaryTags = watch("dietaryTags") ?? [];
  const spicinessLevel = watch("spicinessLevel") ?? "mild";

  const toggleDietaryTag = (id: string) => {
    const next = dietaryTags.includes(id)
      ? dietaryTags.filter((t) => t !== id)
      : [...dietaryTags, id];
    setValue("dietaryTags", next);
  };

  const setSpiciness = (level: SpicinessLevel) => {
    setValue("spicinessLevel", level);
  };

  return (
    <div className="grid grid-cols-2 gap-10">
      <section className="space-y-8">
        <div>
          <h3 className="text-[12px] font-bold text-[#64748B] tracking-widest uppercase mb-4">
            Dietary Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {DIETARY_TAG_OPTIONS.map((opt) => {
              const selected = dietaryTags.includes(opt.id);
              return (
                <Chip
                  key={opt.id}
                  onClick={() => toggleDietaryTag(opt.id)}
                  className="cursor-pointer select-none"
                  color="primary"
                  variant={selected ? "solid" : "bordered"}
                  classNames={
                    selected
                      ? { base: "px-2 font-semibold" }
                      : {
                          base: "border-[#E2E8F0] text-[#64748B] bg-white font-medium",
                        }
                  }
                >
                  {opt.label}
                </Chip>
              );
            })}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#334155] mb-4">
            Spiciness Level
          </h3>
          <div className="flex gap-8">
            {SPICINESS_OPTIONS.map((opt) => {
              const isSelected = spicinessLevel === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSpiciness(opt.id)}
                  className="flex flex-col items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <div
                    className={`flex text-xl gap-0.5 ${
                      isSelected ? "text-[#EF4444]" : "text-[#94A3B8]"
                    }`}
                  >
                    {Array.from({ length: opt.chiliCount }).map((_, i) => (
                      <LuFlame key={i} className="w-5 h-5" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-[#1E293B] uppercase">
                    {opt.label}
                  </span>
                </button>
              );
            })}
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
              <span className="text-sm font-bold text-[#1E293B]">In-Stock</span>
              <span className="text-[11px] text-[#94A3B8]">
                Available for ordering now
              </span>
            </div>
            <Controller
              name="inStock"
              control={control}
              render={({ field }) => (
                <Switch
                  isSelected={field.value}
                  onValueChange={field.onChange}
                  color="primary"
                  size="sm"
                />
              )}
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#1E293B]">
                Visible on Customer App
              </span>
              <span className="text-[11px] text-[#94A3B8]">
                Customers can browse this item
              </span>
            </div>
            <Controller
              name="visibleOnApp"
              control={control}
              render={({ field }) => (
                <Switch
                  isSelected={field.value}
                  onValueChange={field.onChange}
                  color="primary"
                  size="sm"
                />
              )}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

const DietaryAndAvailabilitySection = memo(DietaryAndAvailabilitySectionInner);
export default DietaryAndAvailabilitySection;
