import { ChartConfig } from "@repo/ui/components/chart";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { FaDollarSign } from "react-icons/fa";

export const chartData = [
    { month: "January", revenue: 1200 },
    { month: "February", revenue: 2100 },
    { month: "March", revenue: 1800 },
    { month: "April", revenue: 2400 },
    { month: "May", revenue: 3800 },
    { month: "June", revenue: 4200 },
];

export const chartConfig = {
    revenue: {
        label: "Total Revenue",
        color: "var(--primary)",
    },
} satisfies ChartConfig;

export const charts = [
    {
        title: "Total Revenue",
        value: "$18,450",
        description: "+12.5% from last month",
        icon: FaArrowTrendUp,
    },
    {
        title: "Total Expenses",
        value: "$1,234",
        description: "+8.2% from last month",
        icon: FaArrowTrendDown,
    },
    {
        title: "Net Profit",
        value: "$16,210",
        description: "-3.1% from last month",
        icon: FaDollarSign,
    },
    {
        title: "Profit Margin",
        value: "140%",
        description: "+15.3% from last month",
        icon: FaArrowTrendUp,
    },
];