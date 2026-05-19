import { Card, Progress, Spinner } from "@heroui/react";
import { IoArrowDownCircle, IoArrowUpCircle } from "react-icons/io5";
import { useTopSellingItemsQuery } from "../../../../hooks/Analytics/useAnalytics";
import { useAnalyticsStore } from "../store/useAnalyticsStore";

const TopItems = () => {
  // Fetch data from your revised query hook
  const daysAgo = useAnalyticsStore((state) => state.daysAgo);
  const { data, isLoading } = useTopSellingItemsQuery({ daysAgo });

  if (isLoading) {
    return (
      <Card
        className="border border-default-200 h-[423px] col-span-1 flex items-center justify-center p-6"
        shadow="none"
      >
        <Spinner color="primary" label="Loading analytics..." />
      </Card>
    );
  }

  return (
    <Card
      className="border border-default-200 h-[423px] col-span-1 p-6"
      shadow="none"
    >
      <div className="flex flex-col items-start mb-6 space-y-1">
        <h2 className="text-2xl font-semibold">Top Selling Items</h2>
        <p className="text-small text-default-500">This Week</p>
      </div>

      <div className="flex flex-col gap-6">
        {data?.items?.map((item, i) => {
          const isUpTrend = item.revenuePercentage > 15;

          return (
            <div key={item.menuItemId} className="flex items-end gap-4">
              {/* Rank Number */}
              <span className="text-default-400 font-medium w-4">{i + 1}</span>

              {/* Progress Section */}
              <div className="flex-1">
                <Progress
                  label={item.name}
                  // FIX 2: Map your API value to the HeroUI Progress bar component
                  value={item.revenuePercentage}
                  radius="sm"
                  classNames={{
                    label: "text-small font-medium text-default-700",
                    base: "max-w-md",
                  }}
                />
              </div>

              {/* Stats Section */}
              <div className="flex items-center gap-2 min-w-15 justify-end">
                {/* FIX 3: Display actual revenue share metric */}
                <span className="text-small font-semibold">
                  {item.revenuePercentage}%
                </span>
                {isUpTrend ? (
                  <IoArrowUpCircle size={20} className="text-success" />
                ) : (
                  <IoArrowDownCircle size={20} className="text-danger" />
                )}
              </div>
            </div>
          );
        })}

        {/* Fallback view if items are empty */}
        {data?.items?.length === 0 && (
          <p className="text-small text-default-400 text-center py-8">
            No sales records found for this period.
          </p>
        )}
      </div>
    </Card>
  );
};

export default TopItems;
