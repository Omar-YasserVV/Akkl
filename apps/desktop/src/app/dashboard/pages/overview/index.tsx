import OverviewHeader from "./components/overview-header";
import RecentOrdersTable from "./components/recent-orders-table";
import TopItems from "./components/top-items";

const Overview = () => {
  return (
    <>
      <OverviewHeader />
      <div className="grid grid-cols-4 gap-5">
        <RecentOrdersTable />

        <TopItems />
      </div>
    </>
  );
};

export default Overview;
