import { Skeleton } from "@heroui/react";
import { getStatsConfig } from "../constants/StatsCard.constants";
import { useOrderStats } from "../hooks/useLiveOrders";
import { StatCardItemProps } from "../types/StatsCard.types";
import StatCardItem from "./StatCardItem";

const StatsCard = () => {
  const { data: stats, isLoading } = useOrderStats();
  const statsConfig = getStatsConfig(stats);

  if (isLoading) {
    return (
      <div className="flex gap-4 items-center w-full">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="rounded-lg w-full h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 items-center">
      {statsConfig.map((config: StatCardItemProps) => (
        <StatCardItem key={config.label} {...config} />
      ))}
    </div>
  );
};

export default StatsCard;
