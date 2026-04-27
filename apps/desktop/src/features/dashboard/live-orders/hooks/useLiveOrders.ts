import { Order } from "@/types/Order";
import { PaginatedResponse } from "@/types/PaginatedRespons";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ordersApis } from "../api/LiveOrders";
import { CreateOrderBody } from "../types/LiveOrders.types";
import { orderKeys } from "./LiveOrders.keys";

type OrdersListCacheEntry = readonly [
  unknown,
  PaginatedResponse<Order> | undefined,
];

const updateOrderInList = (
  list: PaginatedResponse<Order> | undefined,
  orderId: string,
  updater: (order: Order) => Order,
) => {
  if (!list) return list;

  return {
    ...list,
    data: list.data.map((order) =>
      order.id === orderId ? updater(order) : order,
    ),
  };
};

const removeOrderFromList = (
  list: PaginatedResponse<Order> | undefined,
  orderId: string,
) => {
  if (!list) return list;

  const nextData = list.data.filter((order) => order.id !== orderId);

  if (nextData.length === list.data.length) {
    return list;
  }

  return {
    ...list,
    data: nextData,
    meta: {
      ...list.meta,
      total: Math.max(0, list.meta.total - 1),
    },
  };
};

// --- Queries ---

export const useOrderDetails = (orderId: string) => {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => ordersApis.getOrderById(orderId),
  });
};

export const useOrderStats = () => {
  return useQuery({
    queryKey: orderKeys.stats(),
    queryFn: () => ordersApis.getOrderStats(),
  });
};

// --- Mutations ---

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderBody) => ordersApis.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: string;
      data: Partial<CreateOrderBody>;
    }) => ordersApis.updateOrder(orderId, data),
    onMutate: async ({ orderId, data }) => {
      await queryClient.cancelQueries({ queryKey: orderKeys.lists() });
      await queryClient.cancelQueries({ queryKey: orderKeys.detail(orderId) });

      const previousLists = queryClient.getQueriesData<
        PaginatedResponse<Order>
      >({
        queryKey: orderKeys.lists(),
      }) as OrdersListCacheEntry[];
      const previousDetail = queryClient.getQueryData<Order>(
        orderKeys.detail(orderId),
      );

      // Exclude `items` from the spread — its shape in CreateOrderBody is
      // incompatible with Order['items'].
      const { items: _items, ...safeData } = data;

      queryClient.setQueriesData<PaginatedResponse<Order>>(
        { queryKey: orderKeys.lists() },
        (current) =>
          updateOrderInList(
            current,
            orderId,
            (order) =>
              ({
                ...order,
                ...safeData,
              }) as Order,
          ),
      );

      if (previousDetail) {
        queryClient.setQueryData<Order>(orderKeys.detail(orderId), {
          ...previousDetail,
          ...safeData,
        } as Order);
      }

      return { previousLists, previousDetail };
    },
    onError: (_, { orderId }, context) => {
      context?.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey as QueryKey, data);
      });

      if (context?.previousDetail) {
        queryClient.setQueryData(
          orderKeys.detail(orderId),
          context.previousDetail,
        );
      }
    },
    onSuccess: (updatedOrder, { orderId }) => {
      queryClient.setQueriesData<PaginatedResponse<Order>>(
        { queryKey: orderKeys.lists() },
        (current) => updateOrderInList(current, orderId, () => updatedOrder),
      );
      queryClient.setQueryData(orderKeys.detail(orderId), updatedOrder);
    },
    onSettled: async (_, __, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => ordersApis.deleteOrder(orderId),
    onMutate: async (orderId) => {
      await queryClient.cancelQueries({ queryKey: orderKeys.lists() });
      await queryClient.cancelQueries({ queryKey: orderKeys.detail(orderId) });

      const previousLists = queryClient.getQueriesData<
        PaginatedResponse<Order>
      >({
        queryKey: orderKeys.lists(),
      }) as OrdersListCacheEntry[];
      const previousDetail = queryClient.getQueryData<Order>(
        orderKeys.detail(orderId),
      );

      queryClient.setQueriesData<PaginatedResponse<Order>>(
        { queryKey: orderKeys.lists() },
        (current) => removeOrderFromList(current, orderId),
      );
      queryClient.removeQueries({ queryKey: orderKeys.detail(orderId) });

      return { previousLists, previousDetail };
    },
    onError: (_, orderId, context) => {
      context?.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey as QueryKey, data);
      });

      if (context?.previousDetail) {
        queryClient.setQueryData(
          orderKeys.detail(orderId),
          context.previousDetail,
        );
      }
    },
    onSettled: async (_, __, orderId) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
    },
  });
};
