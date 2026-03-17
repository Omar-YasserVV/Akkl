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
       grid-cols-3 gap-x-8 gap-y-6"
      >
        <StorageCapacity />
        <RecentStockMovement />
        <StockLevelsTable />
      </div>
    </>
  );
};

export default Warehouse;
