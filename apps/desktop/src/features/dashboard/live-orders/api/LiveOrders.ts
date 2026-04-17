import { apiClient } from "@repo/utils";
import {
  CreateOrderBody,
  Order,
  OrderFilters,
  OrdersStats,
  PaginatedResponse,
} from "../types/LiveOrders.types";

export const ordersApis = {
  createOrder: async (data: CreateOrderBody) => {
    return apiClient.post<Order>(`branches/{branchId}/orders`, data);
  },

  getAllOrders: async (params: OrderFilters) => {
    return apiClient.get<PaginatedResponse<Order>>(`/orders`, { params });
  },

  getOrderStats: async () => {
    return apiClient.get<OrdersStats>(`branches/{branchId}/orders/stats`);
  },

  getOrderById: async (orderId: string) => {
    return apiClient.get<Order>(`/orders/${orderId}`);
  },

  updateOrder: async (orderId: string, data: Partial<CreateOrderBody>) => {
    return apiClient.patch<Order>(`/orders/${orderId}`, data);
  },

  deleteOrder: async (orderId: string) => {
    return apiClient.delete(`/orders/${orderId}`);
  },
};
