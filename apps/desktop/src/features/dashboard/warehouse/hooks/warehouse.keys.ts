import type { ListInventoryQuery } from "../types/inventory.types";

export const warehouseKeys = {
  all: ["warehouse"] as const,
  current: () => [...warehouseKeys.all, "current"] as const,
  ingredients: () => [...warehouseKeys.all, "ingredients"] as const,
  inventoryItem: (id: string) =>
    [...warehouseKeys.all, "inventory-item", id] as const,
  inventoryList: (params: ListInventoryQuery) =>
    [...warehouseKeys.all, "inventory-items", params] as const,
  metaCount: (
    warehouseId: string,
    stockStatus: ListInventoryQuery["stockStatus"],
  ) =>
    [
      ...warehouseKeys.all,
      "inventory-meta",
      warehouseId,
      stockStatus ?? "ALL",
    ] as const,
};
