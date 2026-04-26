import { FetchMenu } from "@/api/Menu/FetchMenu";
import { useQuery } from "@tanstack/react-query";

export const useBranchMenu = () => {
  return useQuery({
    queryKey: ["branch-menu-items"],
    queryFn: () => FetchMenu.getAllMenuItems(),
  });
};
