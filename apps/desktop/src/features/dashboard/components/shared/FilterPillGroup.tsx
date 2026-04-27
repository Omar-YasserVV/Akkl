import { FilterPillGroupProps } from "@/types/Filteration";
import { Button } from "@heroui/react";

const basePillClasses =
  "min-w-[72px] h-9 px-4 rounded-sm text-xs font-medium transition-colors shadow-none";

export default function FilterPillGroup<T>({
  label,
  options,
  value,
  onChange,
  align = "start",
}: FilterPillGroupProps<T>) {
  return (
    <div
      className={`grid grid-cols-[auto_1fr] items-center gap-3 ${
        align === "end" ? "justify-self-end" : ""
      }`}
    >
      <span className="text-sm">{label}</span>

      <div
        className={`flex items-center gap-2 ${
          align === "end" ? "flex-wrap justify-end" : ""
        }`}
      >
        {options.map((option) => (
          <Button
            key={option.label}
            radius="sm"
            size="sm"
            className={`${basePillClasses} ${
              value === option.value
                ? "bg-primary text-white"
                : "bg-white text-black border border-gray-100"
            }`}
            onPress={() => onChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
