import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateOrderBody, ordersApis } from "../api/Orders";
import { OrderFilters } from "../types/PaginatedResponse";

export const useOrders = (filters: OrderFilters) => {
  return useQuery({
    queryKey: ["orders", filters],
    queryFn: () => ordersApis.getOrders(filters),
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderBody) => ordersApis.createOrder(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useTrackedOrder = (orderId?: string, orderNumber?: number) => {
  return useQuery({
    queryKey: ["orders", "track", orderId, orderNumber],
    queryFn: async () => {
      const response = await ordersApis.getOrders({ page: 1, limit: 20 });
      return (
        response.data.find(
          (order) =>
            order.id === orderId ||
            (orderNumber != null && order.orderNumber === orderNumber),
        ) ?? null
      );
    },
    enabled: Boolean(orderId || orderNumber),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "COMPLETED" || status === "CANCELLED") {
        return false;
      }
      return 5000;
    },
  });
};
