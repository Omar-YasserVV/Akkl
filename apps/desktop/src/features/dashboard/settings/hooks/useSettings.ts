import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SettingsApis } from "../api/settings";
import type {
  OnboardingBranchPayload,
  UpdateBranchPayload,
} from "../types/settings.types";

export const useBranchDetails = () => {
  return useQuery({
    queryKey: ["branchDetails"],
    queryFn: () => SettingsApis.getBranchDetails(),
  });
};

export const useOnboardBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: OnboardingBranchPayload) =>
      SettingsApis.onboardBranch(payload),
    onSuccess: (branchDetails) => {
      queryClient.setQueryData(["branchDetails"], branchDetails);
    },
  });
};

export const useFinalizeBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => SettingsApis.finalizeBranch(),
    onSuccess: (branchDetails) => {
      queryClient.setQueryData(["branchDetails"], branchDetails);
    },
  });
};

export const useUpdateBranchSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateBranchPayload) =>
      SettingsApis.updateBranch(payload),
    onSuccess: (branchDetails) => {
      queryClient.setQueryData(["branchDetails"], branchDetails);
    },
  });
};
