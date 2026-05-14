import { apiClient } from "@repo/utils";

import type { CreateBranchMenuItemPayload } from "../types/CreateMenuItem";
import type { MenuItemSummary } from "../types/Menu";

const BASE_URL = "/branches/menu";

const emptySummary: MenuItemSummary = {
  totalItems: 0,
  availableItems: 0,
  averagePrice: "0.00",
  categories: 0,
};

function toNonNegativeInt(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.floor(n);
}

function formatAveragePrice(value: unknown): string {
  if (value == null || value === "") return "0.00";
  if (typeof value === "object" && value !== null) {
    const maybeDecimal = value as { toNumber?: () => number };
    if (typeof maybeDecimal.toNumber === "function") {
      const n = maybeDecimal.toNumber();
      if (Number.isFinite(n)) return n.toFixed(2);
    }
  }
  const n = typeof value === "string" ? Number.parseFloat(value) : Number(value);
  if (!Number.isFinite(n)) return "0.00";
  return n.toFixed(2);
}

/** Coerce gateway / Prisma payloads into a stable summary shape for the UI. */
export function parseMenuSummaryPayload(payload: unknown): MenuItemSummary {
  try {
    if (!payload || typeof payload !== "object") {
      return emptySummary;
    }

    const root = payload as Record<string, unknown>;
    const inner =
      typeof root.data === "object" &&
      root.data !== null &&
      !Array.isArray(root.data) &&
      "totalItems" in (root.data as object)
        ? (root.data as Record<string, unknown>)
        : root;

    return {
      totalItems: toNonNegativeInt(inner.totalItems),
      availableItems: toNonNegativeInt(inner.availableItems),
      averagePrice: formatAveragePrice(inner.averagePrice),
      categories: toNonNegativeInt(inner.categories),
    };
  } catch {
    return { ...emptySummary };
  }
}

export const menuApis = {
  getMenuStats: async (): Promise<MenuItemSummary> => {
    const raw = await apiClient.get<unknown>(`${BASE_URL}/summary`);
    return parseMenuSummaryPayload(raw);
  },

  createMenuItem: async (body: CreateBranchMenuItemPayload) => {
    return apiClient.post<unknown>(BASE_URL, body);
  },
};
