"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@repo/ui/components/chart"; // Ensure this path is correct in your monorepo
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    theme: {
      light: "#2563eb",
      dark: "#3b82f6",
    },
  },
  mobile: {
    label: "Mobile",
    theme: {
      light: "#60a5fa",
      dark: "#93c5fd",
    },
  },
} satisfies ChartConfig;

export function Overview() {
  return (
    // Added h-full/w-full handling to ensure it expands in the desktop container
    <div className="h-[500px] w-full">
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-full w-full"
      >
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.4} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          {/* fill matches the keys in chartConfig */}
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
