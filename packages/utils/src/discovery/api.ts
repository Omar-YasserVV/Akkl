import { apiClient } from "../api";
import type {
  DiscoveryBranch,
  DiscoveryBranchMenu,
  DiscoveryHome,
  DiscoveryMenuItemDetail,
  DiscoveryRestaurant,
  DiscoverySearchResult,
  PaginatedDiscoveryRestaurants,
} from "./types";

export const discoveryApis = {
  getHome: (lat?: number, lng?: number) =>
    apiClient.get<DiscoveryHome>("/discovery/home", {
      params: { lat, lng },
    }),

  getRestaurants: (params?: {
    page?: number;
    limit?: number;
    q?: string;
    lat?: number;
    lng?: number;
  }) =>
    apiClient.get<PaginatedDiscoveryRestaurants>("/discovery/restaurants", {
      params,
    }),

  getRestaurantById: (id: string, lat?: number, lng?: number) =>
    apiClient.get<DiscoveryRestaurant>(`/discovery/restaurants/${id}`, {
      params: { lat, lng },
    }),

  getBranchesNearby: (params?: {
    lat?: number;
    lng?: number;
    radiusKm?: number;
    restaurantId?: string;
    openNow?: boolean;
    q?: string;
  }) =>
    apiClient.get<DiscoveryBranch[]>("/discovery/branches/nearby", { params }),

  getBranchMenu: (branchId: string) =>
    apiClient.get<DiscoveryBranchMenu>(`/discovery/branches/${branchId}/menu`),

  getMenuItem: (itemId: string) =>
    apiClient.get<DiscoveryMenuItemDetail>(`/discovery/menu/${itemId}`),

  search: (q: string, limit?: number) =>
    apiClient.get<DiscoverySearchResult>("/discovery/search", {
      params: { q, limit },
    }),
};

export type {
  DiscoveryBranch,
  DiscoveryBranchMenu,
  DiscoveryHome,
  DiscoveryMenuItem,
  DiscoveryMenuItemDetail,
  DiscoveryRestaurant,
  DiscoverySearchResult,
  DiscoveryMenuVariation,
} from "./types";
