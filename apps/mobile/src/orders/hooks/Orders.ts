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
