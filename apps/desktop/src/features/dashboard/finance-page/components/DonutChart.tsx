"use client"

import { Pie, PieChart, Cell } from "recharts"
import {
    Card,
    CardHeader,
    CardBody,
} from "@heroui/react"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@repo/ui/components/chart"
import { donutChartData, donutChartConfig } from "../constants/donut-chart-constants"

export default function DonutChart() {
    return (
        <Card className="flex flex-col h-full bg-white dark:bg-zinc-900 border-none shadow-sm rounded-lg">
            <CardHeader className="flex justify-between items-start pt-4 px-6">
                <h3 className="text-lg font-bold ">Top Selling Items</h3>
                <span className="text-xl font-bold ">1,658</span>
            </CardHeader>
            <CardBody className="flex flex-row border-t-1 rounded-t-lg border-default-300 shadow-md items-center justify-center py-0 px-6 overflow-visible">
                <div className="flex-1 max-w-[300px]">
                    <ChartContainer
                        config={donutChartConfig}
                        className="mx-auto aspect-square"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={donutChartData}
                                dataKey="value"
                                nameKey="item"
                                innerRadius={80}
                                outerRadius={120}
                                strokeWidth={0}
                            >
                                {donutChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </div>
                <div className="flex flex-col gap-3 ml-8 min-w-[120px]">
                    {donutChartData.map((item) => (
                        <div key={item.item} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-sm"
                                    style={{ backgroundColor: item.fill }}
                                />
                                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                    {donutChartConfig[item.item as keyof typeof donutChartConfig].label}
                                </span>
                            </div>
                            <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">
                                {item.value.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    )
}


