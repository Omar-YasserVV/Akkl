import { useQuery } from "@tanstack/react-query";
import { menuApis } from "../api/menuItem";

export const useMenuStats = () => {
  return useQuery({
    queryKey: ["menu", "stats"],
    queryFn: () => menuApis.getMenuStats(),
  });
};
