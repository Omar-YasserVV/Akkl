import { apiClient } from "@repo/utils";
import {
  GetOrdersData,
  Order,
  OrderSource,
  PaginatedResponse,
} from "../types/PaginatedResponse";

const BASE_URL = "/branches/orders";

export interface CreateOrderBody {
  CustomerName: string;
  items: {
    menuItemId: string;
    quantity: number;
    specialInstructions?: string | null;
    price: number;
  }[];
  status: OrderState;
  userId: string;
  source: OrderSource;
}
export enum OrderState {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export const ordersApis = {
  getOrders: async (data: GetOrdersData) => {
    return apiClient.get<PaginatedResponse<Order>>(`${BASE_URL}/mine`, {
      params: data,
    });
  },

  createOrder: async (data: CreateOrderBody) => {
    return apiClient.post<Order>(BASE_URL, data);
  },
};
