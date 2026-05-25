import { apiClient } from "@repo/utils";
import type {
  GetBranchDetailsResponse,
  OnboardingBranchPayload,
  OnboardingBranchResponse,
  UpdateBranchPayload,
  UpdateBranchResponse,
} from "../types/settings.types";

const BASE_URL = "/branches";

export const SettingsApis = {
  getBranchDetails: async () => {
    return apiClient.get<GetBranchDetailsResponse>(`${BASE_URL}/details`);
  },

  onboardBranch: async (payload: OnboardingBranchPayload) => {
    return apiClient.patch<OnboardingBranchResponse>(
      `${BASE_URL}/onboarding`,
      payload,
    );
  },

  updateBranch: async (payload: UpdateBranchPayload) => {
    return apiClient.patch<UpdateBranchResponse>(`${BASE_URL}/update`, payload);
  },

  deleteBranch: async () => {
    return apiClient.delete<void>(`${BASE_URL}/delete`);
  },
};
