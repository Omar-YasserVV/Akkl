import { memo } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@heroui/react";
import { BiCheckCircle } from "react-icons/bi";
import { SAUCE_CHOICES } from "../../constants/formConfig";
import type { AddMenuItemFormData } from "../../types/AddItem";
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
      <h3 className="text-sm font-semibold text-slate-500 tracking-widest uppercase mb-4">
        Modifier Groups
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add-ons Column */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-900">
              Add-ons
            </label>
            <Button
              size="sm"
              variant="flat"
              className="h-7 text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100"
              onPress={() => {}}
            >
              Add Option
            </Button>
          </div>

          {fields.length > 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
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
            <div className="flex items-center justify-center h-24 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
              No add-ons added yet
            </div>
          )}
        </div>

        {/* Sauce Choices Column */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-900">
              Choices (Sauce)
            </label>
            <Button
              size="sm"
              variant="flat"
              className="h-7 text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100"
            >
              Manage List
            </Button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {SAUCE_CHOICES.map((option) => {
              const isSelected = selectedSauceChoiceIds.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleSauceChoice(option.id)}
                  className="w-full flex justify-between items-center p-3.5 cursor-pointer border-b last:border-0 border-slate-100 hover:bg-slate-50 transition-colors text-left"
                >
                  <span
                    className={`text-sm ${isSelected ? "text-blue-600 font-medium" : "text-slate-600"}`}
                  >
                    {option.name}
                  </span>
                  {isSelected ? (
                    <BiCheckCircle className="w-5 h-5 shrink-0 text-blue-600" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-200 shrink-0" />
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
