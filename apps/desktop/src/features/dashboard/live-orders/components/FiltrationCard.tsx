import { useOrderStore } from "@/store/OrderStore";
import { Button, Card } from "@heroui/react";
import { sources, statuses } from "../constants/StatsCard.constants";

const basePillClasses =
  "min-w-[72px] h-9 px-4 rounded-sm text-xs font-medium transition-colors shadow-none";

const FiltrationCard = () => {
  const { filters, setFilters } = useOrderStore();

  return (
    <Card className="w-full text-md font-normal rounded-lg bg-white shadow-sm px-6 py-3 flex flex-row items-center justify-between gap-8 border-0">
      {/* Source Section */}
      <div className="flex items-center gap-3">
        <span className="text-sm">Source:</span>

        <div className="flex items-center gap-2">
          {sources.map((source) => (
            <Button
              key={source.label}
              radius="sm"
              size="sm"
              className={`${basePillClasses} ${
                filters.source === source.value
                  ? "bg-primary text-white"
                  : "bg-white text-black border border-gray-100"
              }`}
              onPress={() => setFilters({ source: source.value, page: 1 })}
            >
              {source.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Status Section */}
      <div className="flex items-center gap-3">
        <span className="text-sm">Status:</span>

        <div className="flex items-center gap-2 flex-wrap">
          {statuses.map((status) => (
            <Button
              key={status.label}
              radius="sm"
              size="sm"
              className={`${basePillClasses} ${
                filters.status === status.value
                  ? "bg-primary text-white"
                  : "bg-white text-black border border-gray-100"
              }`}
              onPress={() => setFilters({ status: status.value, page: 1 })}
            >
              {status.label}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default FiltrationCard;
