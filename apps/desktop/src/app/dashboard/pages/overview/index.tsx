import OverviewHeader from "./components/overview-header";
import RecentOrdersTable from "./components/recent-orders-table";

const Overview = () => {
  return (
    <>
      <OverviewHeader />
      <div className="grid grid-cols-4 gap-5">
        <RecentOrdersTable />
      </div>
    </>
  );
};

export default Overview;
