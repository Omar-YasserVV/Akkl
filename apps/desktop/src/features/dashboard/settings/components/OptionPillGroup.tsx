import { Button } from "@heroui/react";
import type { ComponentType } from "react";

type OptionIcon = ComponentType<{ className?: string }>;

type OptionPillGroupProps<TValue extends string> = {
  options: TValue[];
  selectedValues: TValue[];
  onToggle: (value: TValue) => void;
  optionIcons?: Record<TValue, OptionIcon>;
};

const OptionPillGroup = <TValue extends string>({
  options,
  selectedValues,
  onToggle,
  optionIcons,
}: OptionPillGroupProps<TValue>) => {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => {
        const isSelected = selectedValues.includes(option);
        const Icon = optionIcons?.[option] as OptionIcon | undefined;

        return (
          <Button
            key={option}
            variant={isSelected ? "solid" : "bordered"}
            color={isSelected ? "primary" : "default"}
            className="flex items-center gap-2 rounded-xl px-5 font-semibold"
            onPress={() => onToggle(option)}
          >
            {Icon ? <Icon className="h-4 w-4" /> : null}
            {option}
          </Button>
        );
      })}
    </div>
  );
};

export default OptionPillGroup;
