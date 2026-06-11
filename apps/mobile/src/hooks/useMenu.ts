import { useQuery } from "@tanstack/react-query";
import { menuApis } from "../api/Menu";

export const useMenu = (branchId: string) => {
  return useQuery({
    queryKey: ["menu", branchId],
    queryFn: () => menuApis.getMenu(branchId),
    enabled: !!branchId,
  });
};
