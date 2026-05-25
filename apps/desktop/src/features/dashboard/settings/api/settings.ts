import { apiClient } from "@repo/utils";
import { GetBranchDetailsResponse } from "../types/settings.types";

const BASE_URL = "/branches/details";

export const SettingsApis = {
  getBranchDetails: async () => {
    return apiClient.get<GetBranchDetailsResponse>(BASE_URL);
  },
};
