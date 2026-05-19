import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import type { BranchMenuItem } from "@/types/Menu";
import type { PaginatedResponse } from "@/types/PaginatedRespons";
import { menuApis } from "../api/menuItem";

type BranchMenuQueryData =
  | BranchMenuItem[]
  | PaginatedResponse<BranchMenuItem>
  | undefined;

type BranchMenuSnapshot = [QueryKey, BranchMenuQueryData][];

export function useDeleteBranchMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => menuApis.deleteMenuItem(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["branch-menu-items"] });

      const previousQueries = queryClient.getQueriesData<BranchMenuQueryData>({
        queryKey: ["branch-menu-items"],
      }) as BranchMenuSnapshot;

      queryClient.setQueriesData<BranchMenuQueryData>(
        { queryKey: ["branch-menu-items"] },
        (current) => {
          if (!current) return current;

          if (Array.isArray(current)) {
            return current.filter((item) => item.id !== id);
          }

          if (current.data && Array.isArray(current.data)) {
            return {
              ...current,
              data: current.data.filter((item) => item.id !== id),
              meta: {
                ...current.meta,
                total: Math.max(0, current.meta.total - 1),
              },
            };
          }

          return current;
        }
      );

      return { previousQueries };
    },

    onError: (_err, _id, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, previousValue]) => {
          queryClient.setQueryData(queryKey, previousValue);
        });
      }
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["branch-menu-items"] });
      void queryClient.invalidateQueries({ queryKey: ["menu", "stats"] });
    },
  });
}
