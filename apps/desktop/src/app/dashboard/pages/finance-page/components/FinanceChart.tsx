import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
} from "@repo/ui/components/chart";
import { CustomTooltip } from "@repo/ui/components/custom-tooltip";
import { formatNumber } from "@repo/utils";
import { chartConfig, chartData } from "../constants/line-chart-constants";

const FInanceChart = () => {
    return (
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
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
                    /* Using your utility for compact currency: $1.2k */
                    tickFormatter={(value) =>
                        formatNumber(value, { isCurrency: true, isCompact: true })
                    }
                />

                <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
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
}

export default FInanceChart