import { BranchMenuItem } from "@/features/dashboard/live-orders/types/LiveOrders.types";
import { apiClient } from "@repo/utils";

export const FetchMenu = {
  //TODO: trace the types for this endpoint, and move it to the correct place
  getAllMenuItems: async () => {
    return apiClient.get<BranchMenuItem[]>("/branches/menu");
  },
};
