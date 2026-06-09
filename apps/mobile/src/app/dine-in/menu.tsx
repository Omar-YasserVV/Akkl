import { SharedMenuView } from "@/components/discovery/shared-menu-view";
import {
  DINE_IN_BRANCH,
  FALLBACK_DINE_IN_MENU,
} from "@/constants/dine-in";
import React from "react";

export default function DineInMenuScreen() {
  return (
    <SharedMenuView
      mode="dine-in"
      branchId={DINE_IN_BRANCH.branchId}
      fallbackMenu={FALLBACK_DINE_IN_MENU}
      cartRoute="/dine-in/cart"
      defaultTableNumber="5"
      defaultBranchContext={DINE_IN_BRANCH}
    />
  );
}
