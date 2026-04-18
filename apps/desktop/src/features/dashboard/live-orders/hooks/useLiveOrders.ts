import { useAuthStore } from "@/store/AuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersApis } from "../api/LiveOrders";
import { CreateOrderBody, OrderFilters } from "../types/LiveOrders.types";
import { orderKeys } from "./LiveOrders.keys";

// --- Queries ---

export const useOrders = (filters: OrderFilters) => {
  const branchId = useAuthStore((state) => state.user?.branchId);

  return useQuery({
    queryKey: [
      ...orderKeys.lists(),
      filters.status,
      filters.source,
      filters.page,
      filters.limit,
    ],
    queryFn: () => ordersApis.getAllOrders(branchId!, filters),
    placeholderData: (previousData) => previousData,
    enabled: !!branchId,
  });
};

export const useOrderDetails = (orderId: string) => {
  const branchId = useAuthStore((state) => state.user?.branchId);

  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => ordersApis.getOrderById(branchId!, orderId),
    enabled: !!branchId && !!orderId,
  });
};

export const useOrderStats = () => {
  const branchId = useAuthStore((state) => state.user?.branchId);

  return useQuery({
    queryKey: orderKeys.stats(),
    queryFn: () => ordersApis.getOrderStats(branchId!),
    enabled: !!branchId,
  });
};

// --- Mutations ---

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const branchId = useAuthStore((state) => state.user?.branchId);

  return useMutation({
    mutationFn: (data: CreateOrderBody) => ordersApis.createOrder(branchId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  const branchId = useAuthStore((state) => state.user?.branchId);

  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: string;
      data: Partial<CreateOrderBody>;
    }) => ordersApis.updateOrder(branchId!, orderId, data),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  const branchId = useAuthStore((state) => state.user?.branchId);

  return useMutation({
    mutationFn: (orderId: string) => ordersApis.deleteOrder(branchId!, orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
    },
  });
};
