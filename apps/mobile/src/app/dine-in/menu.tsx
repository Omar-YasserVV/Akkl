import { SharedMenuView } from "@/components/discovery/shared-menu-view";
import {
  DINE_IN_BRANCH,
  FALLBACK_DINE_IN_MENU,
} from "@/constants/dine-in";
import { useSession } from "@/context/session-context";
import React from "react";

export default function DineInMenuScreen() {
  const { restaurant, branch } = useSession();

  const resolvedBranchId = branch?.id ?? DINE_IN_BRANCH.branchId;
  const defaultBranchContext = {
    branchId: resolvedBranchId,
    restaurantId: restaurant?.id ?? DINE_IN_BRANCH.restaurantId,
    restaurantName: restaurant?.name ?? DINE_IN_BRANCH.restaurantName,
    branchName: branch?.name ?? DINE_IN_BRANCH.branchName,
  };

  return (
    <SharedMenuView
      mode="dine-in"
      branchId={resolvedBranchId}
      fallbackMenu={FALLBACK_DINE_IN_MENU}
      cartRoute="/dine-in/cart"
      defaultTableNumber="5"
      defaultBranchContext={defaultBranchContext}
    />
  );
}
