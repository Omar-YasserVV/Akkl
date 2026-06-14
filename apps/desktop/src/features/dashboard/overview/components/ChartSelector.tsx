import { Button, cn, Skeleton } from "@heroui/react";
import { NumberFormatter } from "@repo/utils";
import { FaDollarSign } from "react-icons/fa";
import { LuShoppingCart } from "react-icons/lu";
import { AnalyticsRecord } from "../types/analytics";

interface ChartItem {
  title: string;
  totalCount?: number;
  percentageChange?: number;
  records?: AnalyticsRecord[];
  isCurrency: boolean;
  isLoading: boolean;
}

interface ChartSelectorProps {
  charts: ChartItem[];
  activeChartIndex: number;
  onSelect: (index: number) => void;
}

const icons = [FaDollarSign, LuShoppingCart];

const ChartSelector = ({
  charts,
  activeChartIndex,
  onSelect,
}: ChartSelectorProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {charts.map((chart, i) => {
        const isActive = activeChartIndex === i;
        const Icon = icons[i];
        const isPositive = (chart.percentageChange ?? 0) >= 0;

        return (
          <Button
            key={i}
            onPress={() => onSelect(i)}
            className={cn(
              "bg-white border-2 p-6 flex-col gap-1 items-start h-auto rounded-2xl shadow-sm transition-all",
              isActive ? "border-primary" : "border-default-200",
            )}
          >
            <div className="flex justify-between items-center w-full">
              <div className="space-y-1 text-start">
                <p className="text-default-400 text-sm">{chart.title}</p>
                {chart.isLoading ? (
                  <Skeleton className="h-8 w-24 rounded-lg" />
                ) : (
                  <p className="text-2xl font-bold text-zinc-800 dark:text-white">
                    {NumberFormatter.getNumberOnly(chart.totalCount ?? 0, {
                      isCurrency: chart.isCurrency,
                      isCompact: true,
                    })}
                  </p>
                )}
              </div>
              <div
                className={cn(
                  "p-2.5 rounded-[10px] transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "bg-primary-50 text-primary",
                )}
              >
                {Icon ? <Icon size={22} /> : null}
              </div>
            </div>

            {chart.isLoading ? (
              <Skeleton className="h-4 w-32 rounded-lg mt-1" />
            ) : (
              <p
                className={cn(
                  "text-xs font-semibold mt-1",
                  isPositive ? "text-green-500" : "text-red-500",
                )}
              >
                {isPositive ? "+" : ""}
                {chart.percentageChange}% from last period
              </p>
            )}
          </Button>
        );
      })}
    </div>
  );
};

export default ChartSelector;
