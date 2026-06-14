import { useOrders } from "@/orders/hooks/Orders";
import { buildProfileStats } from "@/utils/profile";
import { useMemo } from "react";

export function useProfileStats() {
  const { data, isLoading, isError } = useOrders({ page: 1, limit: 100 });

  const stats = useMemo(() => {
    const orders = data?.data ?? [];
    const totalOrders = data?.meta.total ?? orders.length;
    const totalSpent = orders.reduce(
      (sum, order) => sum + Number.parseFloat(order.totalPrice),
      0,
    );

    return buildProfileStats(totalOrders, totalSpent);
  }, [data]);

  return { stats, isLoading, isError };
}
