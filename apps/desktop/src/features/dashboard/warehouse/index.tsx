import RecentStockMovement from "./components/RecentStockMovement";
import StatsGrid from "./components/StatsGrid";
import StockAlerts from "./components/StockAlerts";
import StockLevelsTableManager from "./components/StockLevelsTableManager";
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
        <div className="flex flex-col gap-6 row-span-5">
          <StockAlerts />
          <StorageCapacity />
        </div>
        <StockLevelsTableManager />
        <RecentStockMovement />
      </div>
    </>
  );
};

export default Warehouse;
