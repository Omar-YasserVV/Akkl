import { PaginatedResponse } from "@/types/PaginatedRespons";
import { apiClient } from "@repo/utils";
import type {
  CreateIngredientBody,
  CreateInventoryItemBody,
  IngredientDto,
  InventoryItemDto,
  InventoryUsageLogDto,
  ListInventoryQuery,
  WarehouseSummaryDto,
} from "../types/inventory.types";

const BASE = "/warehouse";

export const warehouseApis = {
  getCurrentWarehouse: () =>
    apiClient.get<WarehouseSummaryDto>(`${BASE}/current`),

  listInventoryItems: (params: ListInventoryQuery) =>
    apiClient.get<PaginatedResponse<InventoryItemDto>>(
      `${BASE}/inventory-items`,
      { params },
    ),

  getInventoryItem: (id: string) =>
    apiClient.get<InventoryItemDto>(`${BASE}/inventory-item/${id}`),

  createInventoryItem: (data: CreateInventoryItemBody) =>
    apiClient.post<InventoryItemDto>(`${BASE}/inventory-item`, data),

  deleteInventoryItem: (id: string) =>
    apiClient.delete<{ success: boolean }>(`${BASE}/inventory-item/${id}`),

  consumeInventoryItem: (id: string, consumedQuantity: number) =>
    apiClient.post<InventoryItemDto>(`${BASE}/inventory-item/${id}/consume`, {
      consumedQuantity,
    }),

  restockInventoryItem: (
    id: string,
    body: {
      addedQuantity: number;
      numberOfUnits?: number;
      unitSize?: number;
      expiresAt?: string;
    },
  ) =>
    apiClient.post<InventoryItemDto>(
      `${BASE}/inventory-item/${id}/restock`,
      body,
    ),

  updateInventoryItem: (
    id: string,
    body: { minimumQuantity?: number; ingredientId?: string },
  ) => apiClient.patch<InventoryItemDto>(`${BASE}/inventory-item/${id}`, body),

  getIngredients: () => apiClient.get<IngredientDto[]>(`${BASE}/ingredients`),

  createIngredient: (data: CreateIngredientBody) =>
    apiClient.post<IngredientDto>(`${BASE}/ingredients`, data),

  getStockAlerts: (warehouseId: string) =>
    apiClient.get<{ items: InventoryItemDto[] }>(`${BASE}/alerts`, {
      params: { warehouseId },
    }),

  getInventoryLogs: (params: {
    warehouseId: string;
    page?: number;
    limit?: number;
  }) =>
    apiClient.get<PaginatedResponse<InventoryUsageLogDto>>(`${BASE}/logs`, {
      params,
    }),
};
