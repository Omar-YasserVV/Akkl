import { useQuery } from "@tanstack/react-query";
import { ordersApis } from "../api/Orders";
import { OrderFilters } from "../types/PaginatedResponse";
// Add this into your query hooks section
export const useOrders = (filters: OrderFilters) => {
  return useQuery({
    queryKey: ["orders", filters],
    queryFn: () => ordersApis.getOrders(filters),
  });
};
