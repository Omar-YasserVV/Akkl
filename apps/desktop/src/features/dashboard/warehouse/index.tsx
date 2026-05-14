import RecentStockMovement from "./components/RecentStockMovement";
import StatsGrid from "./components/StatsGrid";
import StockAlerts from "./components/StockAlerts";
import StockLevelsTableManager from "./components/StockLevelsTableManager";
import StorageCapacity from "./components/StorageCapacity";
import WarehouseHeader from "./components/WarehouseHeader";
import {
  WarehouseBranchProvider,
  useWarehouseBranch,
} from "./context/WarehouseBranchContext";
import { useInventoryItems } from "./hooks/useWarehouse";

function WarehouseDashboardBody() {
  const {
    warehouseId,
    warehouse,
    isLoading: branchLoading,
    error,
  } = useWarehouseBranch();

  const summaryQuery = useInventoryItems(
    warehouseId ? { warehouseId, page: 1, limit: 100 } : null,
  );

  if (error && !branchLoading) {
    const message =
      error instanceof Error ? error.message : "Something went wrong.";
    return (
      <div className="p-8 text-danger">
        Could not load warehouse for this branch: {message}
      </div>
    );
  }

  if (!warehouseId && !branchLoading) {
    return (
      <div className="p-8 text-default-600">
        No warehouse is linked to your branch yet.
      </div>
    );
  }

  return (
    <>
      <WarehouseHeader warehouseName={warehouse?.name} isLoading={branchLoading} />
      <StatsGrid warehouseId={warehouseId} isLoading={branchLoading} />
      <div
        className="grid
       grid-cols-4 grid-rows-5 gap-x-8 gap-y-6 max-h-[calc(100vh-200px)]"
      >
        <div className="flex flex-col gap-6 row-span-5">
          <StockAlerts warehouseId={warehouseId} isLoading={branchLoading} />
          <StorageCapacity
            items={summaryQuery.data?.data ?? []}
            isLoading={branchLoading || summaryQuery.isLoading}
          />
        </div>
        <StockLevelsTableManager />
        <RecentStockMovement warehouseId={warehouseId} isLoading={branchLoading} />
      </div>
    </>
  );
}

const Warehouse = () => {
  return (
    <WarehouseBranchProvider>
      <WarehouseDashboardBody />
    </WarehouseBranchProvider>
  );
};

export default Warehouse;
