import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@repo/ui/components/chart";
import { CustomTooltip } from "@repo/ui/components/custom-tooltip";
import { NumberFormatter } from "@repo/utils";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

// Changed chartData to use days instead of months
const chartData = [
  { day: "2024-06-01", revenue: 250 },
  { day: "2024-06-02", revenue: 320 },
  { day: "2024-06-03", revenue: 400 },
  { day: "2024-06-04", revenue: 380 },
  { day: "2024-06-05", revenue: 470 },
  { day: "2024-06-06", revenue: 510 },
  { day: "2024-06-07", revenue: 600 },
];

const chartConfig = {
  revenue: {
    label: "Total Revenue",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const Chart = () => {
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
          tickFormatter={(value) =>
            NumberFormatter.getNumberOnly(value, {
              isCurrency: true,
              isCompact: true,
            })
          }
        />

        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          // Format date as 'Jun 01', 'Jun 02', etc.
          tickFormatter={(value: string) => {
            const date = new Date(value);
            return `${date.toLocaleString("default", {
              month: "short",
            })} ${String(date.getDate()).padStart(2, "0")}`;
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
          dataKey="revenue"
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

export default Chart;
