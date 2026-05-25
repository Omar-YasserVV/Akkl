import { useQuery } from "@tanstack/react-query";
import { SettingsApis } from "../api/settings";

export const useBranchDetails = () => {
  return useQuery({
    queryKey: ["branchDetails"],
    queryFn: () => SettingsApis.getBranchDetails(),
  });
};
