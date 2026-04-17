import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersApis } from "../api/LiveOrders"; // Adjust path
import { CreateOrderBody, OrderFilters } from "../types/LiveOrders.types";
import { orderKeys } from "./LiveOrders.keys";

// --- Queries ---

export const useOrders = (filters: OrderFilters) => {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () => ordersApis.getAllOrders(filters),
    placeholderData: (previousData) => previousData, // Smooth pagination
  });
};

export const useOrderDetails = (orderId: string) => {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => ordersApis.getOrderById(orderId),
  });
};

export const useOrderStats = () => {
  return useQuery({
    queryKey: orderKeys.stats(),
    queryFn: () => ordersApis.getOrderStats(),
  });
};

// --- Mutations ---

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderBody) => ordersApis.createOrder(data),
    onSuccess: () => {
      // Invalidate lists and stats to reflect the new order
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
    },
  });
};

export const useUpdateOrder = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CreateOrderBody>) =>
      ordersApis.updateOrder(orderId, data),
    onSuccess: (updatedOrder) => {
      // Update individual cache for the order
      queryClient.setQueryData(orderKeys.detail(orderId), updatedOrder);
      // Invalidate related lists
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
    },
  });
};

export const useDeleteOrder = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => ordersApis.deleteOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
    },
  });
};
