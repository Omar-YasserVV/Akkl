import { SharedMenuView } from "@/components/discovery/shared-menu-view";
import { useSession } from "@/context/session-context";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function PickupMenuScreen() {
  const { branchId } = useLocalSearchParams<{ branchId: string }>();
  const { restaurant, branch } = useSession();

  const resolvedBranchId = branchId || branch?.id || "downtown-branch";
  const defaultBranchContext = {
    branchId: resolvedBranchId,
    restaurantId: restaurant?.id ?? "akkl",
    restaurantName: restaurant?.name ?? "Smart Restaurant",
    branchName: branch?.name ?? "Downtown Branch",
  };

  return (
    <SharedMenuView
      mode="pickup"
      branchId={resolvedBranchId}
      cartRoute="/pickup/cart"
      defaultBranchContext={defaultBranchContext}
      fallbackMenu={[]}
    />
  );
}
