import { BranchMenuItem, MenuFilters } from "@/types/Menu";
import { PaginatedResponse } from "@/types/PaginatedRespons";
import { apiClient } from "@repo/utils";

export const FetchMenu = {
  //TODO: trace the types for this endpoint, and move it to the correct place
  getAllMenuItems: async () => {
    return apiClient.get<BranchMenuItem[]>("/branches/menu/all");
  },
  getPaginatedMenuItems: async (params: MenuFilters) => {
    return apiClient.get<PaginatedResponse<BranchMenuItem>>("/branches/menu", {
      params,
    });
  },
};
