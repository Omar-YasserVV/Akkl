import { apiClient } from "@repo/utils";
import {
  GetOrdersData,
  Order,
  PaginatedResponse,
} from "../types/PaginatedResponse";

const BASE_URL = "/branches/orders";

export const ordersApis = {
  getOrders: async (data: GetOrdersData) => {
    return apiClient.get<PaginatedResponse<Order>>(`${BASE_URL}/mine`, {
      params: data,
    });
  },
};
