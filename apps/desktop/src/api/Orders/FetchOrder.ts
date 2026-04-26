import {
  Order,
  OrderFilters,
  PaginatedResponse,
} from "@/features/dashboard/live-orders/types/LiveOrders.types";
import { apiClient } from "@repo/utils";

export const fetchOrders = {
  getAllOrders: async (params: OrderFilters) => {
    return apiClient.get<PaginatedResponse<Order>>("/branches/orders", {
      params,
    });
  },
};
