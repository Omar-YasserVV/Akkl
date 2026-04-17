import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersApis } from "../api/LiveOrders"; // Adjust path
import { CreateOrderBody, OrderFilters } from "../types/LiveOrders.types";
import { orderKeys } from "./LiveOrders.keys";

// --- Queries ---

export const useOrders = (branchId: string, filters: OrderFilters) => {
  return useQuery({
    queryKey: orderKeys.list(branchId, filters),
    queryFn: () => ordersApis.getAllOrders(branchId, filters),
    placeholderData: (previousData) => previousData, // Smooth pagination
    enabled: !!branchId,
  });
};

export const useOrderDetails = (branchId: string, orderId: string) => {
  return useQuery({
    queryKey: orderKeys.detail(branchId, orderId),
    queryFn: () => ordersApis.getOrderById(branchId, orderId),
    enabled: !!branchId && !!orderId,
  });
};

export const useOrderStats = (branchId: string) => {
  return useQuery({
    queryKey: orderKeys.stats(branchId),
    queryFn: () => ordersApis.getOrderStats(branchId),
    enabled: !!branchId,
    refetchInterval: 30000, // Senior touch: Auto-refresh stats every 30s
  });
};

// --- Mutations ---

export const useCreateOrder = (branchId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderBody) =>
      ordersApis.createOrder(branchId, data),
    onSuccess: () => {
      // Invalidate lists and stats to reflect the new order
      queryClient.invalidateQueries({ queryKey: orderKeys.lists(branchId) });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats(branchId) });
    },
  });
};

export const useUpdateOrder = (branchId: string, orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CreateOrderBody>) =>
      ordersApis.updateOrder(branchId, orderId, data),
    onSuccess: (updatedOrder) => {
      // Update individual cache for the order
      queryClient.setQueryData(
        orderKeys.detail(branchId, orderId),
        updatedOrder,
      );
      // Invalidate related lists
      queryClient.invalidateQueries({ queryKey: orderKeys.lists(branchId) });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats(branchId) });
    },
  });
};

export const useDeleteOrder = (branchId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => ordersApis.deleteOrder(branchId, orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists(branchId) });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats(branchId) });
    },
  });
};
