import { createContext, useContext, type ReactNode } from "react";
import { useCurrentWarehouse } from "../hooks/useWarehouse";
import type { WarehouseSummaryDto } from "../types/inventory.types";

type WarehouseBranchContextValue = {
  warehouse: WarehouseSummaryDto | undefined;
  warehouseId: string | undefined;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
};

const WarehouseBranchContext = createContext<
  WarehouseBranchContextValue | undefined
>(undefined);

export function WarehouseBranchProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, error, refetch } = useCurrentWarehouse();

  const value: WarehouseBranchContextValue = {
    warehouse: data,
    warehouseId: data?.id,
    isLoading,
    error,
    refetch,
  };

  return (
    <WarehouseBranchContext.Provider value={value}>
      {children}
    </WarehouseBranchContext.Provider>
  );
}

export function useWarehouseBranch() {
  const ctx = useContext(WarehouseBranchContext);
  if (!ctx) {
    throw new Error(
      "useWarehouseBranch must be used within WarehouseBranchProvider",
    );
  }
  return ctx;
}
