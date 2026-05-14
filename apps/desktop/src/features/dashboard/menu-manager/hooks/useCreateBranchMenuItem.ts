import { useMutation, useQueryClient } from "@tanstack/react-query";
import { menuApis } from "../api/menuItem";
import type { CreateBranchMenuItemPayload } from "../types/CreateMenuItem";

export function useCreateBranchMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBranchMenuItemPayload) =>
      menuApis.createMenuItem(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["branch-menu-items"] });
      void queryClient.invalidateQueries({ queryKey: ["menu", "stats"] });
    },
  });
}
