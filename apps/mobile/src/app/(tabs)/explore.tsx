import { SharedMenuView } from "@/components/discovery/shared-menu-view";
import { FALLBACK_DINE_IN_MENU } from "@/constants/dine-in";
import { useSession } from "@/context/session-context";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function ExploreScreen() {
  const { branchId: branchIdParam } = useLocalSearchParams<{ branchId?: string }>();
  const { restaurant, branch } = useSession();

  const resolvedBranchId = branchIdParam || branch?.id || "";
  const defaultBranchContext = {
    branchId: resolvedBranchId,
    restaurantId: restaurant?.id ?? "akkl",
    restaurantName: restaurant?.name ?? "Smart Restaurant",
    branchName: branch?.name ?? "Branch",
  };

  return (
    <SharedMenuView
      mode="pickup"
      branchId={resolvedBranchId}
      fallbackMenu={FALLBACK_DINE_IN_MENU}
      cartRoute="/pickup/cart"
      defaultBranchContext={defaultBranchContext}
    />
  );
}
