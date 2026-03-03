import { memo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Switch, Chip } from "@heroui/react";
import { LuFlame } from "react-icons/lu";
import type { AddMenuItemFormData, SpicinessLevel } from "../../types/AddItem";
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Left Column: Dietary & Spiciness */}
      <section className="space-y-10">
        <div>
          <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-4">
            Dietary Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {DIETARY_TAG_OPTIONS.map((opt) => {
              const selected = dietaryTags.includes(opt.id);
              return (
                <Chip
                  key={opt.id}
                  onClick={() => toggleDietaryTag(opt.id)}
                  className="cursor-pointer select-none transition-all active:scale-95"
                  color="primary"
                  variant={selected ? "solid" : "bordered"}
                  classNames={
                    selected
                      ? { base: "px-2 font-semibold shadow-sm" }
                      : {
                          base: "border-slate-200 text-slate-500 bg-white font-medium hover:border-blue-200 hover:bg-slate-50",
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
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
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
                  className="group flex flex-col items-center gap-2 transition-all"
                >
                  <div
                    className={`flex text-xl gap-0.5 transition-colors ${
                      isSelected
                        ? "text-red-500"
                        : "text-slate-300 group-hover:text-slate-400"
                    }`}
                  >
                    {Array.from({ length: opt.chiliCount }).map((_, i) => (
                      <LuFlame key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      isSelected ? "text-slate-900" : "text-slate-400"
                    }`}
                  >
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Right Column: Availability */}
      <section>
        <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-4">
          Availability
        </h3>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-slate-800">In-Stock</span>
              <span className="text-[11px] text-slate-400 leading-relaxed">
                Toggle off to mark item as "Sold Out"
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

          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-slate-800">
                Visible on Customer App
              </span>
              <span className="text-[11px] text-slate-400 leading-relaxed">
                Hides the item from the menu entirely
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
