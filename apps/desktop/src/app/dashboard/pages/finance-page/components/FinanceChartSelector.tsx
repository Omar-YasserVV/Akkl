import { Button, cn } from "@heroui/react";
import { charts } from "../constants/line-chart-constants";
import { useFinanceStore } from "@/store/financeStore";

const FinanceChartSelector = () => {
    const { activeChartIndex, setActiveChartIndex } = useFinanceStore();

    return (
        <div className="grid grid-cols-4 gap-4">
            {charts.map((chart, i) => {
                const isActive = activeChartIndex === i;
                return (
                    <Button
                        key={i}
                        onPress={() => setActiveChartIndex(i)}
                        className={cn(
                            "bg-white border-2 p-6 flex-col gap-1 items-start h-auto rounded-2xl shadow-sm transition-all",
                            isActive ? "border-primary" : "border-default-200"
                        )}
                    >
                        <div className="flex justify-between items-center w-full">
                            <div className="space-y-1 text-start">
                                <p className="text-default-400 text-sm">{chart.title}</p>
                                <p className="text-2xl font-bold text-zinc-800 dark:text-white">{chart.value}</p>
                            </div>
                            <div className={cn(
                                "p-2.5 rounded-[10px] transition-colors",
                                isActive ? "bg-primary text-white" : "bg-primary-50 text-primary"
                            )}>
                                <chart.icon size={22} />
                            </div>
                        </div>
                        <p
                            className={cn(
                                "text-xs font-semibold mt-1",
                                chart.description.includes("-")
                                    ? "text-red-500"
                                    : "text-green-500",
                            )}
                        >
                            {chart.description}
                        </p>
                    </Button>
                );
            })}
        </div>
    );
};

export default FinanceChartSelector;


