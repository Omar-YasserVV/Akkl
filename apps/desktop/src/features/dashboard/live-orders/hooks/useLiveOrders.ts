import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersApis } from "../api/LiveOrders";
import { CreateOrderBody, OrderFilters } from "../types/LiveOrders.types";
import { orderKeys } from "./LiveOrders.keys";

// --- Queries ---

export const useOrders = (filters: OrderFilters) => {
  console.log(filters);
  return useQuery({
    queryKey: [
      ...orderKeys.lists(),
      filters.status,
      filters.source,
      filters.page,
      filters.limit,
    ],
    queryFn: () => ordersApis.getAllOrders(filters),
    placeholderData: (previousData) => previousData,
  });
};

export const useOrderDetails = (orderId: string) => {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => ordersApis.getOrderById(orderId),
    enabled: !!orderId,
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
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: string;
      data: Partial<CreateOrderBody>;
    }) => ordersApis.updateOrder(orderId, data),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => ordersApis.deleteOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
    },
  });
};
