import {
  useBranchOrdersQuery,
  useBranchRevenueQuery,
} from "@/hooks/Analytics/useAnalytics";
import { Button, cn, Skeleton } from "@heroui/react";
import React from "react";
import {
  LuDollarSign,
  LuTrendingDown,
  LuTrendingUp,
  LuUsers,
} from "react-icons/lu";
import { MetricType, useAnalyticsStore } from "../store/finance";

type ChartItem = {
  id: MetricType;
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  isLoading: boolean; // Added to handle individual or group loading states
};

const FinanceChartSelector = () => {
  // Sync with your Zustand store state
  const daysAgo = useAnalyticsStore((state) => state.daysAgo);
  const activeMetric = useAnalyticsStore((state) => state.activeMetric);
  const setActiveMetric = useAnalyticsStore((state) => state.setActiveMetric);

  const { data: revenue, isLoading: revenueLoading } =
    useBranchRevenueQuery(daysAgo);
  const { data: orders, isLoading: ordersLoading } =
    useBranchOrdersQuery(daysAgo);

  console.log(orders, "orders");
  console.log(revenue, "revenue");

  // Dynamic label based on days select state to replace the hardcoded "this month"
  const timeframeLabel =
    daysAgo === 1
      ? "yesterday"
      : daysAgo === 7
        ? "this week"
        : daysAgo === 30
          ? "this month"
          : `last ${daysAgo} days`;

  // Kept your exact 4 cards, mapping them to the store IDs
  const charts: ChartItem[] = [
    {
      id: "revenue",
      title: "Total Revenue",
      value: revenue?.totalCount ? `$${revenue.totalCount}` : "$0",
      description: `${revenue?.percentageChange ? (revenue.percentageChange > 0 ? "+" : "") + revenue.percentageChange : "0"}% ${timeframeLabel}`,
      icon: LuDollarSign,
      isLoading: revenueLoading,
    },
    {
      id: "orders",
      title: "Total Expenses",
      value: orders?.totalCount ? `$${orders.totalCount * 10}` : "$0",
      description: ` ${orders?.percentageChange ? (orders.percentageChange > 0 ? "+" : "") + orders.percentageChange : "0"}% ${timeframeLabel}`,
      icon: LuTrendingDown,
      isLoading: ordersLoading,
    },
    {
      id: "profit",
      title: "Profit",
      value: "$16,300",
      description: `+18% ${timeframeLabel}`,
      icon: LuTrendingUp,
      isLoading: revenueLoading || ordersLoading, // Tied to real data endpoints
    },
    {
      id: "customers",
      title: "Customers",
      value: "1,240",
      description: `+6% ${timeframeLabel}`,
      icon: LuUsers,
      isLoading: false, // Set to true or your loading variable if you add a customers hook later
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {charts.map((chart) => {
        const isActive = activeMetric === chart.id;

        return (
          <Button
            key={chart.id}
            onPress={() => setActiveMetric(chart.id)}
            className={cn(
              "bg-white border-2 p-6 flex-col gap-1 items-start h-auto rounded-2xl shadow-sm transition-all",
              isActive ? "border-primary" : "border-default-200",
            )}
          >
            <div className="flex justify-between items-center w-full">
              <div className="space-y-1 text-start w-full pr-2">
                <p className="text-default-400 text-sm">{chart.title}</p>

                {/* Value Skeleton Loader */}
                {chart.isLoading ? (
                  <Skeleton className="h-7 w-24 rounded-lg mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-zinc-800 dark:text-white">
                    {chart.value}
                  </p>
                )}
              </div>

              <div
                className={cn(
                  "p-2.5 rounded-[10px] transition-colors shrink-0",
                  isActive
                    ? "bg-primary text-white"
                    : "bg-primary-50 text-primary",
                )}
              >
                <chart.icon size={22} />
              </div>
            </div>

            {/* Subtext/Description Skeleton Loader */}
            {chart.isLoading ? (
              <Skeleton className="h-4 w-32 rounded-md mt-1.5" />
            ) : (
              <p
                className={cn(
                  "text-xs font-semibold mt-1",
                  chart.description.includes("-")
                    ? "text-red-500"
                    : "text-green-500",
                )}
              >
                {chart.description}
              </p>
            )}
          </Button>
        );
      })}
    </div>
  );
};

export default FinanceChartSelector;
