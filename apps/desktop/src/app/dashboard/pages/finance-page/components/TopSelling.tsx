import { Card, CardHeader, CardBody } from "@heroui/react"
import { topSellingListData } from '../constants/donut-chart-constants'

const TopSelling = () => {
    return (
        <Card className="flex flex-col h-full bg-background border-none shadow-sm rounded-lg">
            <CardHeader className="pt-6 px-6">
                <h3 className="text-lg font-bold ">Top Selling Items</h3>
            </CardHeader>
            <CardBody className="px-6 pb-6 overflow-y-auto custom-scrollbar">
                <div className="flex flex-col gap-3">
                    {topSellingListData.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col gap-1 p-4 bg-card  rounded-lg"
                        >
                            <div className="flex justify-between items-start">
                                <span className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
                                    {item.name}
                                </span>
                                <span className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
                                    ${item.price.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-zinc-400 font-medium">
                                    {item.sold} sold
                                </span>
                                <span className="text-zinc-400 font-medium">
                                    {item.revenuePercentage}% of revenue
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    )
}

export default TopSelling
