import FinanceChartManager from "./components/FinanceChartManager";
import FinanceHeader from "./components/FinanceHeader";
import DonutChart from "./components/DonutChart";
import TopSelling from "./components/TopSelling";
import RecentExpenses from "./components/RecentExpenses";

const FinancePage = () => {
  return (
    <>
      <FinanceHeader />
      <FinanceChartManager />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-100">
        <TopSelling />
        <DonutChart />
      </div>
      <RecentExpenses />
    </>
  );
};

export default FinancePage;
