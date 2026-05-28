import {
  useBranchExpensesQuery,
  useBranchOrdersQuery,
  useBranchRevenueQuery,
} from "@/hooks/Analytics/useAnalytics";
import { Card } from "@heroui/react";
import { useState } from "react";
import { useAnalyticsStore } from "../store/finance";
import FinanceChart from "./FinanceChart";
import FinanceChartSelector from "./FinanceChartSelector";

const FinanceChartManager = () => {
  const [activeChartIndex, setActiveChartIndex] = useState(0);
  const daysAgo = useAnalyticsStore((state) => state.daysAgo);

  const { data: revenue, isLoading: revenueLoading } =
    useBranchRevenueQuery(daysAgo);
  const { data: orders, isLoading: ordersLoading } =
    useBranchOrdersQuery(daysAgo);
  const { data: expenses, isLoading: expensesLoading } =
    useBranchExpensesQuery(daysAgo);

  const charts = [
    {
      title: "Total Revenue",
      totalCount: revenue?.totalCount,
      percentageChange: revenue?.percentageChange,
      records: revenue?.records,
      isCurrency: true,
      isLoading: revenueLoading,
    },
    {
      title: "Total Orders",
      totalCount: orders?.totalCount,
      percentageChange: orders?.percentageChange,
      records: orders?.records,
      isCurrency: false,
      isLoading: ordersLoading,
    },
    {
      title: "Total Expenses",
      totalCount: expenses?.totalCount,
      percentageChange: expenses?.percentageChange,
      records: expenses?.records,
      isCurrency: true,
      isLoading: expensesLoading,
    },
  ];

  const activeChart = charts[activeChartIndex];

  return (
    <Card
      className="border border-default-200 col-span-4 p-6 space-y-14"
      shadow="none"
    >
      <FinanceChartSelector
        charts={charts}
        activeChartIndex={activeChartIndex}
        onSelect={setActiveChartIndex}
      />
      <FinanceChart
        records={activeChart?.records ?? []}
        isCurrency={!!activeChart?.isCurrency}
        isLoading={!!activeChart?.isLoading}
      />
    </Card>
  );
};

export default FinanceChartManager;
