import FilterPillGroup from "@/features/dashboard/components/shared/FilterPillGroup";
import { FilterOption } from "@/types/Filteration";
import { MenuFilters } from "@/types/Menu";
import { Card } from "@heroui/react";

const categoryOptions: FilterOption<MenuFilters["category"]>[] = [
  { label: "All", value: undefined },
  { label: "Appetizer", value: "APPETIZER" },
  { label: "Main", value: "MAIN_COURSE" },
  { label: "Sides", value: "SIDE_DISH" },
  { label: "Drinks", value: "BEVERAGE" },
  { label: "Desserts", value: "DESSERT" },
  { label: "Other", value: "OTHER" },
];

const availabilityOptions: FilterOption<MenuFilters["isAvailable"]>[] = [
  { label: "All", value: undefined },
  { label: "Available", value: true },
  { label: "Unavailable", value: false },
];

type MenuManagerFilterProps = {
  filters: MenuFilters;
  onChange: (filters: Partial<MenuFilters>) => void;
};

const MenuManagerFilter = ({ filters, onChange }: MenuManagerFilterProps) => {
  return (
    <Card className="w-full text-md font-normal rounded-lg bg-white shadow-sm px-6 py-3 max-xl:gap-1 xl:grid grid-cols-[auto_1fr_auto] items-center border-0">
      <FilterPillGroup
        label="Category:"
        options={categoryOptions}
        value={filters.category}
        onChange={(category) => onChange({ category, page: 1 })}
      />
      <div />
      <FilterPillGroup
        label="Availability:"
        options={availabilityOptions}
        value={filters.isAvailable}
        onChange={(isAvailable) => onChange({ isAvailable, page: 1 })}
        align="end"
      />
    </Card>
  );
};

export default MenuManagerFilter;
