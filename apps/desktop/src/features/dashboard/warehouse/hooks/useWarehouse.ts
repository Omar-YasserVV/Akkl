import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { warehouseApis } from "../api/warehouse";
import type {
  CreateIngredientBody,
  CreateInventoryItemBody,
  ListInventoryQuery,
} from "../types/inventory.types";
import { warehouseKeys } from "./warehouse.keys";

export const useCurrentWarehouse = () =>
  useQuery({
    queryKey: warehouseKeys.current(),
    queryFn: () => warehouseApis.getCurrentWarehouse(),
  });

export const useIngredients = () =>
  useQuery({
    queryKey: warehouseKeys.ingredients(),
    queryFn: () => warehouseApis.getIngredients(),
  });

export const useInventoryItems = (params: ListInventoryQuery | null) =>
  useQuery({
    queryKey: params
      ? warehouseKeys.inventoryList(params)
      : ([...warehouseKeys.all, "inventory-items", "disabled"] as const),
    queryFn: () => warehouseApis.listInventoryItems(params!),
    enabled: !!params?.warehouseId,
  });

export const useInventoryItem = (id: string | null) =>
  useQuery({
    queryKey: id ? warehouseKeys.inventoryItem(id) : ["warehouse", "skip"],
    queryFn: () => warehouseApis.getInventoryItem(id!),
    enabled: !!id,
  });

export const useStockAlerts = (warehouseId: string | undefined) =>
  useQuery({
    queryKey: warehouseId
      ? [...warehouseKeys.all, "alerts", warehouseId]
      : (["warehouse", "alerts", "disabled"] as const),
    queryFn: () => warehouseApis.getStockAlerts(warehouseId!),
    enabled: !!warehouseId,
  });

export const useInventoryLogs = (params: {
  warehouseId: string;
  page?: number;
  limit?: number;
}) =>
  useQuery({
    queryKey: [...warehouseKeys.all, "logs", params],
    queryFn: () => warehouseApis.getInventoryLogs(params),
    enabled: !!params.warehouseId,
  });

/** Lightweight total count for a stock filter (uses `meta.total`). */
export const useInventoryMetaCount = (
  warehouseId: string | undefined,
  stockStatus: ListInventoryQuery["stockStatus"],
) =>
  useQuery({
    queryKey: warehouseKeys.metaCount(warehouseId ?? "", stockStatus),
    queryFn: () =>
      warehouseApis.listInventoryItems({
        warehouseId: warehouseId!,
        page: 1,
        limit: 1,
        ...(stockStatus ? { stockStatus } : {}),
      }),
    enabled: !!warehouseId,
    select: (res) => res.meta.total,
  });

const invalidateInventory = (
  queryClient: ReturnType<typeof useQueryClient>,
  warehouseId?: string,
) => {
  void queryClient.invalidateQueries({ queryKey: warehouseKeys.all });
  if (warehouseId) {
    void queryClient.invalidateQueries({
      queryKey: [...warehouseKeys.all, "inventory-meta", warehouseId],
    });
  }
};

export const useCreateIngredient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateIngredientBody) =>
      warehouseApis.createIngredient(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: warehouseKeys.ingredients(),
      });
    },
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInventoryItemBody) =>
      warehouseApis.createInventoryItem(data),
    onSuccess: (_data, variables) => {
      invalidateInventory(queryClient, variables.warehouseId);
    },
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { id: string; warehouseId: string }) =>
      warehouseApis.deleteInventoryItem(variables.id),
    onSuccess: (_data, variables) => {
      invalidateInventory(queryClient, variables.warehouseId);
    },
  });
};

export const useConsumeInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: {
      id: string;
      consumedQuantity: number;
      warehouseId: string;
    }) =>
      warehouseApis.consumeInventoryItem(
        variables.id,
        variables.consumedQuantity,
      ),
    onSuccess: (_data, variables) => {
      invalidateInventory(queryClient, variables.warehouseId);
    },
  });
};

export const useRestockInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: {
      id: string;
      warehouseId: string;
      addedQuantity: number;
      numberOfUnits?: number;
      unitSize?: number;
      expiresAt?: string;
    }) =>
      warehouseApis.restockInventoryItem(variables.id, {
        addedQuantity: variables.addedQuantity,
        numberOfUnits: variables.numberOfUnits,
        unitSize: variables.unitSize,
        expiresAt: variables.expiresAt,
      }),
    onSuccess: (_data, variables) => {
      invalidateInventory(queryClient, variables.warehouseId);
    },
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: {
      id: string;
      warehouseId: string;
      minimumQuantity?: number;
      ingredientId?: string;
    }) =>
      warehouseApis.updateInventoryItem(variables.id, {
        minimumQuantity: variables.minimumQuantity,
        ingredientId: variables.ingredientId,
      }),
    onSuccess: (_data, variables) => {
      invalidateInventory(queryClient, variables.warehouseId);
    },
  });
};
