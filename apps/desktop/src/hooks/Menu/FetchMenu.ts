import { FetchMenu } from "@/api/Menu/FetchMenu";
import { MenuFilters } from "@/types/Menu";
import { useQuery } from "@tanstack/react-query";

export const useBranchMenu = (filters?: MenuFilters) => {
  return useQuery({
    queryKey: ["branch-menu-items", filters],
    queryFn: () => FetchMenu.getAllMenuItems(filters),
    placeholderData: (previousData) => previousData,
  });
};
