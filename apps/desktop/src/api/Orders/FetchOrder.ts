import {
  Order,
  OrderFilters,
} from "@/features/dashboard/live-orders/types/LiveOrders.types";
import { PaginatedResponse } from "@/types/PaginatedRespons";
import { apiClient } from "@repo/utils";

export const fetchOrders = {
  getAllOrders: async (params: OrderFilters) => {
    return apiClient.get<PaginatedResponse<Order>>("/branches/orders", {
      params,
    });
  },
};
