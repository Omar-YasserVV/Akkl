"use client";

import { useTopSellingItemsQuery } from "@/hooks/Analytics/useAnalytics";
import { Card, CardBody, CardHeader, Spinner } from "@heroui/react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@repo/ui/components/chart";
import { Cell, Pie, PieChart } from "recharts";
import { useAnalyticsStore } from "../../overview/store/useAnalyticsStore";

const CHART_COLORS = [
  "#FFC107",
  "#4CAF50",
  "#2196F3",
  "#9C27B0",
  "#F44336",
  "#9E9E9E",
];

export default function DonutChart() {
  const daysAgo = useAnalyticsStore((state) => state.daysAgo);
  const { data, isLoading } = useTopSellingItemsQuery({ daysAgo, topN: 6 });

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

  // Map API items to chart-compatible shape with colors
  const chartItems = (data?.items ?? []).map((item, index) => ({
    ...item,
    value: item.sold,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }));

  // Build dynamic ChartConfig from live data
  const chartConfig: ChartConfig = {
    value: { label: "Items Sold" },
    ...Object.fromEntries(
      chartItems.map((item) => [
        item.menuItemId,
        { label: item.name, color: item.fill },
      ]),
    ),
  };

  const totalSold = chartItems.reduce((sum, item) => sum + item.sold, 0);

  return (
    <Card className="flex flex-col h-full bg-white dark:bg-zinc-900 border-none shadow-sm rounded-lg">
      <CardHeader className="flex justify-between items-start pt-4 px-6">
        <h3 className="text-lg font-bold">Top Selling Items</h3>
        <span className="text-xl font-bold">
          {isLoading ? "—" : totalSold.toLocaleString()}
        </span>
      </CardHeader>
      <CardBody className="flex flex-row border-t-1 rounded-t-lg border-default-300 items-center justify-center py-0 px-6 shadow-3xl! overflow-visible">
        <div className="flex-1 max-w-75">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartItems}
                dataKey="value"
                nameKey="name"
                innerRadius={80}
                outerRadius={120}
                strokeWidth={0}
              >
                {chartItems.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
        <div className="flex flex-col gap-3 ml-8 min-w-30">
          {chartItems.map((item) => (
            <div
              key={item.menuItemId}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {item.name}
                </span>
              </div>
              <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">
                {item.sold.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
