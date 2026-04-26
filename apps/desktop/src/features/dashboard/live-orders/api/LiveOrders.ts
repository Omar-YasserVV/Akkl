import { OrderState } from "@repo/types";
import { apiClient } from "@repo/utils";
import { CreateOrderBody, Order } from "../types/LiveOrders.types";

const BASE_URL = "/branches/orders";

export const ordersApis = {
  createOrder: async (data: CreateOrderBody) => {
    return apiClient.post<Order>(BASE_URL, data);
  },

  getOrderStats: async () => {
    return apiClient.get<Partial<Record<OrderState, number>>>(
      `${BASE_URL}/stats`,
    );
  },

  getOrderById: async (orderId: string) => {
    return apiClient.get<Order>(`${BASE_URL}/${orderId}`);
  },

  updateOrder: async (orderId: string, data: Partial<CreateOrderBody>) => {
    return apiClient.patch<Order>(`${BASE_URL}/${orderId}`, data);
  },

  deleteOrder: async (orderId: string) => {
    return apiClient.delete(`${BASE_URL}/${orderId}`);
  },
};
