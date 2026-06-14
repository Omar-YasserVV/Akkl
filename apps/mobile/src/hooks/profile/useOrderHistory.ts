import { useOrders } from "@/orders/hooks/Orders";
import { Order } from "@/orders/types/PaginatedResponse";
import { useMemo } from "react";

export function useOrderHistory() {
  const query = useOrders({ page: 1, limit: 50 });

  const summary = useMemo(() => {
    const orders = query.data?.data ?? [];
    const totalSpent = orders.reduce(
      (sum, order) => sum + Number.parseFloat(order.totalPrice),
      0,
    );

    return {
      totalSpent,
      orderCount: query.data?.meta.total ?? orders.length,
    };
  }, [query.data]);

  return {
    orders: (query.data?.data ?? []) as Order[],
    summary,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    refetch: query.refetch,
    isError: query.isError,
  };
}
