import { discoveryApis, type DiscoveryMenuItem } from "@repo/utils";

export interface BranchMenuResponse {
  items: DiscoveryMenuItem[];
}

export const menuApis = {
  getMenu: async (branchId: string): Promise<BranchMenuResponse> => {
    const data = await discoveryApis.getBranchMenu(branchId);

    return {
      items: data.categories.flatMap((section) => section.items),
    };
  },
};
