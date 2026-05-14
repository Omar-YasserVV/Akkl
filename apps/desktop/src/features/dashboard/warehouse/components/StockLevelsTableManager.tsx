import PaginationButtons from "@/features/dashboard/components/shared/PaginationButtons";
import { useMemo, useState } from "react";
import { useWarehouseBranch } from "../context/WarehouseBranchContext";
import { useInventoryItems } from "../hooks/useWarehouse";
import type { InventoryItemDto, StockStatus } from "../types/inventory.types";
import InventoryItemActionModal from "./InventoryItemActionModal";
import StockLevelsTable from "./StockLevelsTable";

const StockLevelsTableManager = () => {
  const { warehouseId } = useWarehouseBranch();
  const [page, setPage] = useState(1);
  const [stockFilterKey, setStockFilterKey] = useState("ALL");
  const [modal, setModal] = useState<{
    item: InventoryItemDto;
    mode: "consume" | "restock" | "editMin";
  } | null>(null);

  const listParams = useMemo(() => {
    if (!warehouseId) return null;
    const stockStatus: StockStatus | undefined =
      stockFilterKey === "ALL" ? undefined : (stockFilterKey as StockStatus);
    return {
      warehouseId,
      page,
      limit: 10,
      ...(stockStatus ? { stockStatus } : {}),
    };
  }, [warehouseId, page, stockFilterKey]);

  const { data, isLoading } = useInventoryItems(listParams);

  const rows = data?.data ?? [];
  const totalPages = data?.meta.pages ?? 1;

  const closeModal = () => setModal(null);

  if (!warehouseId) {
    return null;
  }

  return (
    <>
      <StockLevelsTable
        data={rows}
        isLoading={isLoading}
        stockStatusKey={stockFilterKey}
        onStockStatusChange={(key) => {
          setStockFilterKey(key);
          setPage(1);
        }}
        onRowAction={(item, mode) => setModal({ item, mode })}
        pagination={
          totalPages > 1 ? (
            <PaginationButtons
              page={page}
              total={totalPages}
              onChange={(p) => setPage(p)}
            />
          ) : null
        }
      />
      <InventoryItemActionModal
        mode={modal?.mode ?? null}
        item={modal?.item ?? null}
        warehouseId={warehouseId}
        onClose={closeModal}
      />
    </>
  );
};

export default StockLevelsTableManager;
