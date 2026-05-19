import {
  useBranchOrdersQuery,
  useBranchRevenueQuery,
} from "@/hooks/Analytics/useAnalytics";
import { Card, Spinner } from "@heroui/react";
import { useState } from "react";
import { useAnalyticsStore } from "../store/useAnalyticsStore";
import Chart from "./Chart";
import ChartSelector from "./ChartSelector";

const ChartManager = () => {
  const [activeChartIndex, setActiveChartIndex] = useState(0);
  const daysAgo = useAnalyticsStore((state) => state.daysAgo);

  const { data: revenue, isLoading: revenueLoading } =
    useBranchRevenueQuery(daysAgo);
  const { data: orders, isLoading: ordersLoading } =
    useBranchOrdersQuery(daysAgo);

  const isLoading = revenueLoading || ordersLoading;

  const charts = [
    {
      title: "Total Revenue",
      totalCount: revenue?.totalCount,
      percentageChange: revenue?.percentageChange,
      records: revenue?.records,
      isCurrency: true,
      isLoading: revenueLoading,
    },
    {
      title: "Total Orders",
      totalCount: orders?.totalCount,
      percentageChange: orders?.percentageChange,
      records: orders?.records,
      isCurrency: false,
      isLoading: ordersLoading,
    },
  ];

  const activeChart = charts[activeChartIndex];

  return (
    <Card
      className="border border-default-200 col-span-4 p-6 space-y-14"
      shadow="none"
    >
      {isLoading && (
        <div className="flex items-center justify-center h-40 w-full">
          <Spinner size="lg" />
        </div>
      )}
      {!isLoading && (
        <>
          <ChartSelector
            charts={charts}
            activeChartIndex={activeChartIndex}
            onSelect={setActiveChartIndex}
          />
          <Chart
            records={activeChart?.records ?? []}
            isCurrency={!!activeChart?.isCurrency}
            isLoading={!!activeChart?.isLoading}
          />
        </>
      )}
    </Card>
  );
};

export default ChartManager;
