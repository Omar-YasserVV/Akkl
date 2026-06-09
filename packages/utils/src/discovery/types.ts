export interface DiscoveryNearestBranch {
  id: string;
  name: string;
  address?: string | null;
  distanceKm: number | null;
  openStatus: "OPEN" | "CLOSING_SOON" | "CLOSED";
  openUntil?: string;
}

export interface DiscoveryRestaurant {
  id: string;
  name: string;
  logoUrl: string | null;
  cuisineLabel: string;
  branchCount: number;
  nearestBranch: DiscoveryNearestBranch | null;
  branches?: DiscoveryBranchSummary[];
}

export interface DiscoveryBranchSummary {
  id: string;
  name: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  weeklyHours?: unknown;
  openStatus: "OPEN" | "CLOSING_SOON" | "CLOSED";
  openUntil?: string;
  distanceKm: number | null;
}

export interface DiscoveryBranch {
  id: string;
  name: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  weeklyHours?: unknown;
  status: string;
  openStatus: "OPEN" | "CLOSING_SOON" | "CLOSED";
  openUntil?: string;
  distanceKm: number | null;
  restaurant: {
    id: string;
    name: string;
    logoUrl: string | null;
  };
}

export interface DiscoveryMenuVariation {
  id: string;
  size: string;
  price: number;
  discountPrice: number | null;
}

export interface DiscoveryMenuItem {
  id: string;
  branchId: string;
  menuItemId: string;
  name: string;
  description?: string | null;
  image?: string | null;
  category: string;
  price: number;
  discountPrice: number | null;
  preparationTime: number;
  isAvailable: boolean;
  variations: DiscoveryMenuVariation[];
  dietaryTags: { id: string; name: string }[];
  restaurantId?: string;
  restaurantName?: string;
  restaurantLogoUrl?: string | null;
  branchName?: string;
  badge?: string;
  subtitle?: string;
}

export interface DiscoveryHome {
  featuredRestaurants: DiscoveryRestaurant[];
  offers: DiscoveryMenuItem[];
  topDeals: DiscoveryMenuItem[];
}

export interface DiscoverySearchResult {
  restaurants: DiscoveryRestaurant[];
  dishes: DiscoveryMenuItem[];
}

export interface DiscoveryBranchMenu {
  branch: {
    id: string;
    name: string;
    address?: string | null;
    restaurant: {
      id: string;
      name: string;
      logoUrl: string | null;
    };
  };
  categories: {
    category: string;
    label: string;
    items: DiscoveryMenuItem[];
  }[];
}

export interface DiscoveryMenuItemDetail {
  item: DiscoveryMenuItem;
  pairings: DiscoveryMenuItem[];
}

export interface PaginatedDiscoveryRestaurants {
  data: DiscoveryRestaurant[];
  meta: {
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
  };
}
