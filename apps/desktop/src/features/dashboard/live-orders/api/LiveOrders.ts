import { OrderState } from "@repo/types";
import { apiClient } from "@repo/utils";
import {
  CreateOrderBody,
  Order,
  OrderFilters,
  PaginatedResponse,
} from "../types/LiveOrders.types";

const BASE_URL = "/branches/{branchId}/orders";

const getUrl = (branchId: string | number) =>
  BASE_URL.replace("{branchId}", branchId.toString());

export const ordersApis = {
  createOrder: async (branchId: string | number, data: CreateOrderBody) => {
    return apiClient.post<Order>(getUrl(branchId), data);
  },

  getAllOrders: async (branchId: string | number, params: OrderFilters) => {
    return apiClient.get<PaginatedResponse<Order>>(getUrl(branchId), params);
  },

  getOrderStats: async (branchId: string | number) => {
    return apiClient.get<Partial<Record<OrderState, number>>>(
      `${getUrl(branchId)}/stats`,
    );
  },

  getOrderById: async (branchId: string | number, orderId: string) => {
    return apiClient.get<Order>(`${getUrl(branchId)}/${orderId}`);
  },

  updateOrder: async (
    branchId: string | number,
    orderId: string,
    data: Partial<CreateOrderBody>,
  ) => {
    return apiClient.patch<Order>(`${getUrl(branchId)}/${orderId}`, data);
  },

  deleteOrder: async (branchId: string | number, orderId: string) => {
    return apiClient.delete(`${getUrl(branchId)}/${orderId}`);
  },
};
