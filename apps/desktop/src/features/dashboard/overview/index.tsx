import ChartManager from "./components/ChartManager";
import OverviewHeader from "./components/OverviewHeader";
import RecentOrdersTable from "./components/RecentOrdersTable";
import TopItems from "./components/TopItems";

const Overview = () => {
  return (
    <>
      <OverviewHeader />
      <div className="grid grid-cols-4 gap-5">
        <ChartManager />
        <RecentOrdersTable />
        <TopItems />
      </div>
    </>
  );
};

export default Overview;
