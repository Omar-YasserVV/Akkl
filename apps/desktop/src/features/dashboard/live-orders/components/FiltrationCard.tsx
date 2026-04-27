import FilterPillGroup from "@/features/dashboard/components/shared/FilterPillGroup";
import { Card } from "@heroui/react";
import { sources, statuses } from "../constants/StatsCard.constants";
import { useOrderStore } from "../store/OrderStore";

const FiltrationCard = () => {
  const { filters, setFilters } = useOrderStore();

  return (
    <Card className="w-full text-md font-normal rounded-lg bg-white shadow-sm px-6 py-3 max-xl:gap-1 xl:grid grid-cols-[auto_1fr_auto] items-center border-0">
      <FilterPillGroup
        label="Source:"
        options={[...sources]}
        value={filters.source}
        onChange={(source) => setFilters({ source, page: 1 })}
      />
      <div />
      <FilterPillGroup
        label="Status:"
        options={[...statuses]}
        value={filters.status}
        onChange={(status) => setFilters({ status, page: 1 })}
        align="end"
      />
    </Card>
  );
};

export default FiltrationCard;
