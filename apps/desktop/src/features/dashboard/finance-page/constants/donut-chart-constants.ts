import { type ChartConfig } from "@repo/ui/components/chart"

export const donutChartData = [
    { item: "burger", value: 4136, fill: "#FFC107" },
    { item: "pizza1", value: 3678, fill: "#4CAF50" },
    { item: "fries", value: 2766, fill: "#2196F3" },
    { item: "pizza2", value: 1434, fill: "#9C27B0" },
    { item: "pizza3", value: 794, fill: "#F44336" },
    { item: "pizza4", value: 156, fill: "#9E9E9E" },
]

export const donutChartConfig = {
    value: {
        label: "Items Sold",
    },
    burger: {
        label: "Burger",
        color: "#FFC107",
    },
    pizza1: {
        label: "Pizza",
        color: "#4CAF50",
    },
    fries: {
        label: "Fries",
        color: "#2196F3",
    },
    pizza2: {
        label: "Pizza",
        color: "#9C27B0",
    },
    pizza3: {
        label: "Pizza",
        color: "#F44336",
    },
    pizza4: {
        label: "Pizza",
        color: "#9E9E9E",
    },
} satisfies ChartConfig

export const topSellingListData = [
    {
        name: "Burger",
        sold: 2,
        price: 17.98,
        revenuePercentage: 58.1,
    },
    {
        name: "Pizza",
        sold: 1,
        price: 12.99,
        revenuePercentage: 41.9,
    },
    {
        name: "Pizza",
        sold: 1,
        price: 9.99,
        revenuePercentage: 41.9,
    },
    {
        name: "Pizza",
        sold: 1,
        price: 9.99,
        revenuePercentage: 41.9,
    },
    {
        name: "Pizza",
        sold: 1,
        price: 9.99,
        revenuePercentage: 41.9,
    },
]
