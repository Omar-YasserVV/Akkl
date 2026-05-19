import { useTopSellingItemsQuery } from "@/hooks/Analytics/useAnalytics";
import { Card, CardBody, CardHeader, Spinner } from "@heroui/react";
import { useAnalyticsStore } from "../../overview/store/useAnalyticsStore";

const TopSelling = () => {
  const daysAgo = useAnalyticsStore((state) => state.daysAgo);

  const { data, isLoading } = useTopSellingItemsQuery({ daysAgo });

  if (isLoading) {
    return (
      <Card
        className="border border-default-200 h-105.75 col-span-1 flex items-center justify-center p-6"
        shadow="none"
      >
        <Spinner color="primary" label="Loading Top Selling Items..." />
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full bg-background border-none shadow-sm rounded-lg">
      <CardHeader className="pt-6 px-6">
        <h3 className="text-lg font-bold ">Top Selling Items</h3>
      </CardHeader>
      <CardBody className="px-6 pb-6 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col gap-3">
          {data?.items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-1 p-4 bg-card  rounded-lg"
            >
              <div className="flex justify-between items-start">
                <span className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
                  {item.name}
                </span>
                <span className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
                  ${item.price.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400 font-medium">
                  {item.sold} sold
                </span>
                <span className="text-zinc-400 font-medium">
                  {item.revenuePercentage}% of revenue
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default TopSelling;
