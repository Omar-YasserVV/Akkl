import { apiClient } from "@repo/utils";
import {
  CreateOrderBody,
  Order,
  OrderFilters,
  OrdersStats,
  PaginatedResponse,
} from "../types/LiveOrders.types";

export const ordersApis = {
  createOrder: async (branchId: string, data: CreateOrderBody) => {
    return apiClient.post<Order>(`/branches/${branchId}/orders`, data);
  },

  getAllOrders: async (branchId: string, params: OrderFilters) => {
    return apiClient.get<PaginatedResponse<Order>>(
      `/branches/${branchId}/orders`,
      {
        params,
      },
    );
  },

  getOrderStats: async (branchId: string) => {
    return apiClient.get<OrdersStats>(`/branches/${branchId}/orders/stats`);
  },

  getOrderById: async (branchId: string, orderId: string) => {
    return apiClient.get<Order>(`/branches/${branchId}/orders/${orderId}`);
  },
  updateOrder: async (
    branchId: string,
    orderId: string,
    data: Partial<CreateOrderBody>,
  ) => {
    return apiClient.patch<Order>(
      `/branches/${branchId}/orders/${orderId}`,
      data,
    );
  },

  deleteOrder: async (branchId: string, orderId: string) => {
    return apiClient.delete(`/branches/${branchId}/orders/${orderId}`);
  },
};
