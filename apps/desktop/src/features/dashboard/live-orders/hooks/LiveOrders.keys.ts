import { OrderFilters } from "../types/LiveOrders.types";

export const orderKeys = {
  all: ["orders"] as const,
  lists: (branchId: string) => [...orderKeys.all, "list", branchId] as const,
  list: (branchId: string, filters: OrderFilters) =>
    [...orderKeys.lists(branchId), { filters }] as const,
  details: (branchId: string) =>
    [...orderKeys.all, "detail", branchId] as const,
  detail: (branchId: string, orderId: string) =>
    [...orderKeys.details(branchId), orderId] as const,
  stats: (branchId: string) => [...orderKeys.all, "stats", branchId] as const,
};
