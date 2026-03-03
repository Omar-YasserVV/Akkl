import { memo } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@heroui/react";
import { BiPlus } from "react-icons/bi";
import type { AddMenuItemFormData } from "../../types/AddItem";
import SizeRow from "./SizeRow";

function VariationsSectionInner() {
  const { control, watch } = useFormContext<AddMenuItemFormData>();
  const { fields, remove } = useFieldArray({
    control,
    name: "sizes",
  });

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[12px] font-bold text-slate-500 tracking-widest uppercase">
          Variations & Sizes
        </h3>
        <Button
          size="sm"
          variant="light"
          startContent={<BiPlus />}
          className="font-bold text-sm text-primary hover:bg-primary/5!"
          onPress={() => {}}
        >
          Add Size
        </Button>
      </div>
      <div className="space-y-3">
        {fields.length ? (
          fields.map((field, index) => (
            <SizeRow
              key={field.id}
              index={index}
              watch={watch}
              onRemove={() => remove(index)}
            />
          ))
        ) : (
          <div className="text-center py-4 rounded-2xl text-slate-500">
            There are no variations & sizes
          </div>
        )}
      </div>
    </section>
  );
}

const VariationsSection = memo(VariationsSectionInner);
export default VariationsSection;
