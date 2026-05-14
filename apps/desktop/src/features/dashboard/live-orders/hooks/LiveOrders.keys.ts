import { OrderFilters } from "@/types/Order";

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters: OrderFilters) => [...orderKeys.lists(), { filters }] as const,
  menu: () => [...orderKeys.all, "menu"] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (orderId: string) => [...orderKeys.details(), orderId] as const,
  stats: () => [...orderKeys.all, "stats"] as const,
};
