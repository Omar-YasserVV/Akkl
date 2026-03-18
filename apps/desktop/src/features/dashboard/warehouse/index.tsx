import RecentStockMovement from "./components/RecentStockMovement";
import StatsGrid from "./components/StatsGrid";
import StockLevelsTable from "./components/StockLevelsTable";
import StorageCapacity from "./components/StorageCapacity";
import WarehouseHeader from "./components/WarehouseHeader";

const Warehouse = () => {
  return (
    <>
      <WarehouseHeader />
      <StatsGrid />
      <div
        className="grid
       grid-cols-4 grid-rows-5 gap-x-8 gap-y-6 max-h-[calc(100vh-200px)]"
      >
        <div className="space-y-6">
          <StorageCapacity />
        </div>
        <StockLevelsTable />
        <RecentStockMovement />
      </div>
    </>
  );
};

export default Warehouse;
