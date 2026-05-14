import { memo } from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Button, Input, Select, SelectItem, Skeleton } from "@heroui/react";
import { BiPlus, BiTrash } from "react-icons/bi";
import { useIngredients } from "@/features/dashboard/warehouse/hooks/useWarehouse";
import { SHARED_INPUT_CLASS_NAMES } from "../../constants/SharedInputStyle";
import type { AddMenuItemFormData } from "../../types/AddItem";

function RecipeSectionInner() {
  const { control } = useFormContext<AddMenuItemFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "recipeRows",
  });
  const { data: ingredients, isPending } = useIngredients();

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-[12px] font-bold text-slate-500 tracking-widest uppercase">
            Recipe (ingredients)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Link warehouse ingredients and how much each serving uses.
          </p>
        </div>
        <Button
          size="sm"
          variant="light"
          startContent={<BiPlus />}
          className="font-bold text-sm text-primary hover:bg-primary/5!"
          onPress={() =>
            append({
              id: crypto.randomUUID(),
              ingredientId: "",
              quantityRequired: "",
            })
          }
        >
          Add ingredient
        </Button>
      </div>

      {isPending ? (
        <Skeleton className="h-24 w-full rounded-xl" />
      ) : fields.length === 0 ? (
        <div className="text-center py-6 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-sm">
          No recipe lines yet. Optional — add ingredients to track usage.
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-wrap items-end gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-xs"
            >
              <Controller
                name={`recipeRows.${index}.ingredientId`}
                control={control}
                render={({ field: f }) => (
                  <Select
                    label="Ingredient"
                    labelPlacement="outside"
                    placeholder="Choose ingredient"
                    selectedKeys={f.value ? [f.value] : []}
                    onSelectionChange={(keys) => {
                      const v = Array.from(keys)[0];
                      f.onChange(typeof v === "string" ? v : "");
                    }}
                    className="min-w-[200px] flex-1"
                    classNames={{
                      trigger: SHARED_INPUT_CLASS_NAMES.inputWrapper.join(" "),
                    }}
                  >
                    {(ingredients ?? []).map((ing) => (
                      <SelectItem key={ing.id} textValue={ing.name}>
                        {ing.name}{" "}
                        <span className="text-slate-400 text-xs">({ing.unit})</span>
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
              <Controller
                name={`recipeRows.${index}.quantityRequired`}
                control={control}
                render={({ field: f }) => (
                  <Input
                    {...f}
                    type="text"
                    inputMode="decimal"
                    label="Quantity"
                    labelPlacement="outside"
                    placeholder="e.g. 0.25"
                    className="w-32"
                    classNames={SHARED_INPUT_CLASS_NAMES}
                  />
                )}
              />
              <Button
                isIconOnly
                variant="light"
                size="sm"
                className="text-slate-400 hover:text-danger mb-0.5"
                onPress={() => remove(index)}
              >
                <BiTrash size={18} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

const RecipeSection = memo(RecipeSectionInner);
export default RecipeSection;
