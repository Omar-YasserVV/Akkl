import { apiClient } from "@repo/utils";

import { MenuItemSummary } from "../types/Menu";
const BASE_URL = "/branches/menu";

export const menuApis = {
  getMenuStats: async () => {
    return apiClient.get<MenuItemSummary>(`${BASE_URL}/summary`);
  },
};
