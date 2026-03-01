import { memo } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@heroui/react";
import { BiCheckCircle } from "react-icons/bi";
import { SAUCE_CHOICES } from "../../constants/formConfig";
import type { AddMenuItemFormData } from "../../types/types";
import AddOnRow from "./AddOnRow";

function ModifiersSectionInner() {
  const { control, watch, setValue } = useFormContext<AddMenuItemFormData>();
  const { fields, remove } = useFieldArray({
    control,
    name: "addOns",
  });
  const selectedSauceChoiceIds = watch("selectedSauceChoiceIds") ?? [];

  const toggleSauceChoice = (id: string) => {
    const next = selectedSauceChoiceIds.includes(id)
      ? selectedSauceChoiceIds.filter((x) => x !== id)
      : [...selectedSauceChoiceIds, id];
    setValue("selectedSauceChoiceIds", next);
  };

  return (
    <section className="mb-10">
      <h3 className="text-sm font-semibold text-[#64748B] tracking-widest uppercase mb-4">
        Modifier Groups
      </h3>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-[#0F172A]">
              Add-ons
            </label>
            <Button
              size="sm"
              variant="flat"
              className="h-7 text-[12px] font-bold bg-[#144BB80D] text-[#1A71FF]"
              onPress={() => {}}
            >
              Add Option
            </Button>
          </div>
          {fields.length ? (
            <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
              {fields.map((field, index) => (
                <AddOnRow
                  key={field.id}
                  index={index}
                  watch={watch}
                  onRemove={() => remove(index)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-[#64748B]">
              there is no Add-ons
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-[#0F172A]">
              Choices (Sauce)
            </label>
            <Button
              size="sm"
              variant="flat"
              className="h-7 text-[12px] font-bold bg-[#144BB80D] text-[#1A71FF]"
            >
              Add Option
            </Button>
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
            {SAUCE_CHOICES.map((option) => {
              const selected = selectedSauceChoiceIds.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleSauceChoice(option.id)}
                  className="w-full flex justify-between items-center p-3.5 cursor-pointer border-b last:border-0 border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors text-left"
                >
                  <span className="text-sm text-[#475569]">{option.name}</span>
                  {selected ? (
                    <BiCheckCircle className="w-5 h-5 shrink-0 text-primary" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-[#E2E8F0] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

const ModifiersSection = memo(ModifiersSectionInner);
export default ModifiersSection;
