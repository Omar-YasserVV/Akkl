import { Card } from "@heroui/react";
import FinanceChartSelector from "./FinanceChartSelector";
import FinanceChart from "./FinanceChart";

const FinanceChartManager = () => {
    return (
        <Card
            className="border border-default-200 col-span-4 p-6 space-y-14"
            shadow="none"
        >
            <FinanceChartSelector />
            <FinanceChart />
        </Card>
    );
};

export default FinanceChartManager;
