import {
  useBranchOrdersQuery,
  useBranchRevenueQuery,
} from "@/hooks/Analytics/useAnalytics";
import { Skeleton } from "@heroui/react";
import { ChartContainer, ChartTooltip } from "@repo/ui/components/chart";
import { CustomTooltip } from "@repo/ui/components/custom-tooltip";
import { NumberFormatter } from "@repo/utils";
import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { chartConfig } from "../constants/line-chart-constants";
import { useAnalyticsStore } from "../store/finance";

const FInanceChart = () => {
  // 1. Sync with global store state
  const daysAgo = useAnalyticsStore((state) => state.daysAgo);
  const activeMetric = useAnalyticsStore((state) => state.activeMetric);

  // 2. Fetch real-time analytical data hooks concurrently
  const { data: revenue, isLoading: revenueLoading } =
    useBranchRevenueQuery(daysAgo);
  const { data: orders, isLoading: ordersLoading } =
    useBranchOrdersQuery(daysAgo);

  const isLoading = revenueLoading || ordersLoading;

  // 3. Dynamically switch chart dataset based on active card metric
  const chartData = React.useMemo(() => {
    switch (activeMetric) {
      case "revenue":
        return revenue?.records || [];
      case "orders":
        // Map to expenses placeholder calculation (value * 10) to match your selector card value
        return (
          orders?.records.map((item) => ({
            timestamp: item.timestamp,
            value: item.value * 10,
          })) || []
        );
      case "profit":
        // Dynamically compute net profit per index/timestamp record
        return (
          revenue?.records.map((revRecord, index) => {
            const orderVal = (orders?.records[index]?.value || 0) * 10;
            return {
              timestamp: revRecord.timestamp,
              value: revRecord.value - orderVal,
            };
          }) || []
        );
      case "customers":
        return orders?.records || []; // Fallback placeholder matching layout structure
      default:
        return [];
    }
  }, [activeMetric, revenue, orders]);

  // Helper formatting function to convert ISO string timestamps into short UI display dates
  const formatXAxis = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (daysAgo <= 1) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Keep a clean skeleton loading transition to match the cards
  if (isLoading) {
    return <Skeleton className="h-75 w-full rounded-2xl" />;
  }

  return (
    <ChartContainer config={chartConfig} className="h-75 w-full">
      <AreaChart accessibilityLayer data={chartData}>
        <defs>
          <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-revenue)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-revenue)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} strokeDasharray="3 3" />

        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickCount={5}
          dataKey="value"
          tickFormatter={(value) =>
            NumberFormatter.getNumberOnly(value, {
              isCurrency: activeMetric !== "customers", // Turn off currency symbol for customer count metric
              isCompact: true,
            })
          }
        />

        <XAxis
          dataKey="timestamp"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={15}
          tickFormatter={formatXAxis}
        />

        <ChartTooltip
          cursor={{
            stroke: "var(--primary)",
            strokeWidth: 2,
            strokeDasharray: "5 5",
          }}
          content={<CustomTooltip />}
        />

        <Area
          dataKey="value"
          type="natural"
          fill="url(#fillRevenue)"
          stroke="var(--color-revenue)"
          strokeWidth={3}
          activeDot={{
            r: 8,
            fill: "var(--primary)",
            stroke: "var(--background)",
            strokeWidth: 4,
          }}
        />
      </AreaChart>
    </ChartContainer>
  );
};

export default FInanceChart;
