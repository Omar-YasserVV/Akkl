import { Order, OrderFilters } from "@/types/Order";
import { PaginatedResponse } from "@/types/PaginatedRespons";
import { apiClient } from "@repo/utils";

export const fetchOrders = {
  getAllOrders: async (params: OrderFilters) => {
    return apiClient.get<PaginatedResponse<Order>>("/branches/orders", {
      params,
    });
  },
};
