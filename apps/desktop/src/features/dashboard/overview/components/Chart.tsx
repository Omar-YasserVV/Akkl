import { Skeleton } from "@heroui/react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@repo/ui/components/chart";
import { CustomTooltip } from "@repo/ui/components/custom-tooltip";
import { NumberFormatter } from "@repo/utils";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { AnalyticsRecord } from "../types/analytics";

interface ChartProps {
  records: AnalyticsRecord[];
  isCurrency: boolean;
  isLoading: boolean;
}

const chartConfig = {
  value: {
    label: "Value",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const Chart = ({ records, isCurrency, isLoading }: ChartProps) => {
  if (isLoading) return <Skeleton className="h-75 w-full rounded-xl" />;

  return (
    <ChartContainer config={chartConfig} className="h-75 w-full">
      <AreaChart accessibilityLayer data={records}>
        <defs>
          <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-value)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-value)"
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
          tickFormatter={(value) =>
            NumberFormatter.getNumberOnly(value, {
              isCurrency,
              isCompact: true,
            })
          }
        />

        <XAxis
          dataKey="timestamp"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: string) => {
            const date = new Date(value);
            return `${date.toLocaleString("default", { month: "short" })} ${String(date.getDate()).padStart(2, "0")}`;
          }}
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
          fill="url(#fillValue)"
          stroke="var(--color-value)"
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

export default Chart;
