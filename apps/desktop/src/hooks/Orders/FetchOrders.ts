import { fetchOrders } from "@/api/Orders/FetchOrder";
import { orderKeys } from "@/features/dashboard/live-orders/hooks/LiveOrders.keys";
import { OrderFilters } from "@/features/dashboard/live-orders/types/LiveOrders.types";
import { useQuery } from "@tanstack/react-query";

export const useOrders = (filters: OrderFilters) => {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () => fetchOrders.getAllOrders(filters),
    placeholderData: (previousData) => previousData,
  });
};
