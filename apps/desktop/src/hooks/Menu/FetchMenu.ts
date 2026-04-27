import { FetchMenu } from "@/api/Menu/FetchMenu";
import { MenuFilters } from "@/types/Menu";
import { useQuery } from "@tanstack/react-query";

export const useBranchMenu = () => {
  return useQuery({
    queryKey: ["branch-menu-items", "all"],
    queryFn: () => FetchMenu.getAllMenuItems(),
  });
};

export const usePaginatedBranchMenu = (filters: MenuFilters) => {
  return useQuery({
    queryKey: ["branch-menu-items", "paginated", filters],
    queryFn: () => FetchMenu.getPaginatedMenuItems(filters),
    placeholderData: (previousData) => previousData,
  });
};
