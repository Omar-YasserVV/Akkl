import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import type { BranchMenuItem } from "@/types/Menu";
import type { PaginatedResponse } from "@/types/PaginatedRespons";
import { menuApis } from "../api/menuItem";
import type { UpdateBranchMenuItemPayload } from "../types/CreateMenuItem";

type BranchMenuQueryData =
  | BranchMenuItem[]
  | PaginatedResponse<BranchMenuItem>
  | undefined;

type BranchMenuSnapshot = [QueryKey, BranchMenuQueryData][];

type UpdateBranchMenuItemVariables = {
  id: string;
  payload: UpdateBranchMenuItemPayload;
};

function applyMenuItemUpdate(
  current: BranchMenuQueryData,
  id: string,
  updater: (item: BranchMenuItem) => BranchMenuItem,
): BranchMenuQueryData {
  if (!current) return current;

  if (Array.isArray(current)) {
    return current.map((item) => (item.id === id ? updater(item) : item));
  }

  return {
    ...current,
    data: current.data.map((item) => (item.id === id ? updater(item) : item)),
  };
}

export function useUpdateBranchMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateBranchMenuItemVariables) =>
      menuApis.updateMenuItem(id, payload),

    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ["branch-menu-items"] });

      const previousQueries = queryClient.getQueriesData<BranchMenuQueryData>({
        queryKey: ["branch-menu-items"],
      }) as BranchMenuSnapshot;

      const updatedFields = {
        name: payload.name,
        description: payload.description,
        isAvailable: payload.isAvailable,
        price: payload.price,
        preparationTime: payload.preparationTime,
        category: payload.category,
      };
      const optimisticFields: Partial<BranchMenuItem> = {};

      if (updatedFields.name !== undefined) {
        optimisticFields.name = updatedFields.name;
      }
      if (updatedFields.description !== undefined) {
        optimisticFields.description = updatedFields.description;
      }
      if (updatedFields.isAvailable !== undefined) {
        optimisticFields.isAvailable = updatedFields.isAvailable;
      }
      if (updatedFields.price !== undefined) {
        optimisticFields.price = updatedFields.price;
      }
      if (updatedFields.preparationTime !== undefined) {
        optimisticFields.preparationTime = updatedFields.preparationTime;
      }
      if (updatedFields.category !== undefined) {
        optimisticFields.category = updatedFields.category;
      }

      queryClient.setQueriesData<BranchMenuQueryData>(
        { queryKey: ["branch-menu-items"] },
        (current) =>
          applyMenuItemUpdate(current, id, (item) => ({
            ...item,
            ...optimisticFields,
          })),
      );

      return { previousQueries };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, previousValue]) => {
          queryClient.setQueryData(queryKey, previousValue);
        });
      }
    },

    onSuccess: (updatedItem, { id }) => {
      queryClient.setQueriesData<BranchMenuQueryData>(
        { queryKey: ["branch-menu-items"] },
        (current) => applyMenuItemUpdate(current, id, () => updatedItem),
      );
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["menu", "stats"] });
    },
  });
}
