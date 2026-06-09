import { PrismaService } from '@app/db';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { BranchStatus, Prisma } from 'libs/db/generated/client/client';
import {
  formatCategoryLabel,
  formatPrice,
  getBranchOpenStatus,
  haversineKm,
} from 'utils/discovery.util';

@Injectable()
export class DiscoveryService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly menuInclude = {
    variations: true,
    dietaryTags: true,
  } as const;

  private mapMenuItem(
    item: {
      id: string;
      branchId: string;
      menuItemId: string;
      name: string;
      description: string | null;
      image: string | null;
      category: string;
      price: unknown;
      discountPrice: unknown;
      preparationTime: number;
      isAvailable: boolean;
      variations?: Array<{
        id: string;
        size: string;
        price: unknown;
        discountPrice: unknown;
      }>;
      dietaryTags?: Array<{ id: string; name: string }>;
    },
    restaurant?: { id: string; name: string; logoUrl: string | null },
    branch?: { id: string; name: string },
  ) {
    return {
      id: item.id,
      branchId: item.branchId,
      menuItemId: item.menuItemId,
      name: item.name,
      description: item.description,
      image: item.image,
      category: item.category,
      price: formatPrice(item.price),
      discountPrice: item.discountPrice
        ? formatPrice(item.discountPrice)
        : null,
      preparationTime: item.preparationTime,
      isAvailable: item.isAvailable,
      variations: (item.variations ?? []).map((v) => ({
        id: v.id,
        size: v.size,
        price: formatPrice(v.price),
        discountPrice: v.discountPrice ? formatPrice(v.discountPrice) : null,
      })),
      dietaryTags: (item.dietaryTags ?? []).map((t) => ({
        id: t.id,
        name: t.name,
      })),
      restaurantId: restaurant?.id,
      restaurantName: restaurant?.name,
      restaurantLogoUrl: restaurant?.logoUrl,
      branchName: branch?.name,
    };
  }

  private async getCuisineLabel(restaurantId: string): Promise<string> {
    const grouped = await this.prisma.branchMenuItem.groupBy({
      by: ['category'],
      where: {
        isAvailable: true,
        branch: { restaurantId, status: BranchStatus.ACTIVE },
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 1,
    });

    if (!grouped.length || !grouped[0]) return 'Restaurant';
    return formatCategoryLabel(grouped[0].category);
  }

  private mapBranch(
    branch: Prisma.BranchGetPayload<{
      include: { restaurant: true };
    }>,
    lat?: number,
    lng?: number,
  ) {
    const openInfo = getBranchOpenStatus(branch.weeklyHours);
    const distanceKm =
      lat != null &&
      lng != null &&
      branch.latitude != null &&
      branch.longitude != null
        ? haversineKm(lat, lng, branch.latitude, branch.longitude)
        : null;

    return {
      id: branch.id,
      name: branch.name,
      address: branch.address,
      latitude: branch.latitude,
      longitude: branch.longitude,
      weeklyHours: branch.weeklyHours,
      status: branch.status,
      openStatus: openInfo.status,
      openUntil: openInfo.until,
      distanceKm,
      restaurant: {
        id: branch.restaurant.id,
        name: branch.restaurant.name,
        logoUrl: branch.restaurant.logoUrl,
      },
    };
  }

  async discoverBranchesNearby(params: {
    lat?: number;
    lng?: number;
    radiusKm?: number;
    restaurantId?: string;
    openNow?: boolean;
    q?: string;
  }) {
    const { lat, lng, radiusKm = 50, restaurantId, openNow, q } = params;

    // Build base where condition
    const where: any = {
      status: BranchStatus.ACTIVE,
      latitude: { not: null },
      longitude: { not: null },
    };
    if (restaurantId) {
      where.restaurantId = restaurantId;
    }
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { address: { contains: q, mode: 'insensitive' } },
        {
          restaurant: {
            name: { contains: q, mode: 'insensitive' },
          },
        },
      ];
    }

    // Prisma `findMany` with join to restaurant for filtering
    const branches = await this.prisma.branch.findMany({
      where,
      include: { restaurant: true },
    });

    // Map branches to computed structure and filter by distance if needed
    let mapped = branches.map((branch) => this.mapBranch(branch, lat, lng));

    if (lat != null && lng != null) {
      mapped = mapped
        .filter((b) => b.distanceKm != null && b.distanceKm <= radiusKm)
        .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
    } else {
      mapped = mapped.sort((a, b) =>
        a.restaurant.name.localeCompare(b.restaurant.name),
      );
    }

    if (openNow) {
      mapped = mapped.filter((b) => b.openStatus === 'OPEN');
    }

    return mapped;
  }

  async discoverBranchMenu(branchId: string) {
    const branch = await this.prisma.branch.findFirst({
      where: { id: branchId, status: BranchStatus.ACTIVE },
      include: { restaurant: true },
    });

    if (!branch) {
      throw new RpcException({ message: 'Branch not found', status: 404 });
    }

    const items = await this.prisma.branchMenuItem.findMany({
      where: { branchId, isAvailable: true },
      include: this.menuInclude,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });

    const grouped = items.reduce(
      (acc, item) => {
        const key = item.category;
        if (!acc[key]) acc[key] = [];
        acc[key].push(
          this.mapMenuItem(item, branch.restaurant, {
            id: branch.id,
            name: branch.name,
          }),
        );
        return acc;
      },
      {} as Record<string, ReturnType<typeof this.mapMenuItem>[]>,
    );

    return {
      branch: {
        id: branch.id,
        name: branch.name,
        address: branch.address,
        restaurant: {
          id: branch.restaurant.id,
          name: branch.restaurant.name,
          logoUrl: branch.restaurant.logoUrl,
        },
      },
      categories: Object.entries(grouped).map(([category, menuItems]) => ({
        category,
        label: formatCategoryLabel(category),
        items: menuItems,
      })),
    };
  }

  async discoverMenuItem(itemId: string) {
    const item = await this.prisma.branchMenuItem.findFirst({
      where: { id: itemId, isAvailable: true },
      include: {
        ...this.menuInclude,
        branch: { include: { restaurant: true } },
      },
    });

    if (!item) {
      throw new RpcException({ message: 'Menu item not found', status: 404 });
    }

    const pairings = await this.prisma.branchMenuItem.findMany({
      where: {
        branchId: item.branchId,
        isAvailable: true,
        id: { not: item.id },
        OR: [
          { category: item.category },
          { category: { in: ['SIDE_DISH', 'BEVERAGE', 'APPETIZER'] } },
        ],
      },
      include: this.menuInclude,
      take: 4,
    });

    return {
      item: this.mapMenuItem(item, item.branch.restaurant, {
        id: item.branch.id,
        name: item.branch.name,
      }),
      pairings: pairings.map((p) =>
        this.mapMenuItem(p, item.branch.restaurant, {
          id: item.branch.id,
          name: item.branch.name,
        }),
      ),
    };
  }

  async discoverHome(params: { lat?: number; lng?: number }) {
    const { lat, lng } = params;

    const restaurants = await this.prisma.restaurant.findMany({
      where: { branches: { some: { status: BranchStatus.ACTIVE } } },
      include: {
        branches: {
          where: { status: BranchStatus.ACTIVE },
        },
      },
      take: 6,
    });

    const featuredRestaurants = await Promise.all(
      restaurants.map(async (restaurant) => {
        const branches = restaurant.branches
          .map((b) => ({
            branch: b,
            distanceKm:
              lat != null &&
              lng != null &&
              b.latitude != null &&
              b.longitude != null
                ? haversineKm(lat, lng, b.latitude, b.longitude)
                : null,
          }))
          .sort(
            (a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity),
          );

        const nearest = branches[0]?.branch;
        const openInfo = nearest
          ? getBranchOpenStatus(nearest.weeklyHours)
          : { status: 'OPEN' as const };

        return {
          id: restaurant.id,
          name: restaurant.name,
          logoUrl: restaurant.logoUrl,
          cuisineLabel: await this.getCuisineLabel(restaurant.id),
          branchCount: restaurant.branches.length,
          nearestBranch: nearest
            ? {
                id: nearest.id,
                name: nearest.name,
                distanceKm: branches[0]?.distanceKm ?? null,
                openStatus: openInfo.status,
                openUntil: openInfo.until,
              }
            : null,
        };
      }),
    );

    const offerItems = await this.prisma.branchMenuItem.findMany({
      where: {
        isAvailable: true,
        discountPrice: { not: null },
        branch: { status: BranchStatus.ACTIVE },
      },
      include: {
        ...this.menuInclude,
        branch: { include: { restaurant: true } },
      },
      take: 10,
      orderBy: { updatedAt: 'desc' },
    });

    const topSelling = await this.prisma.orderItem.groupBy({
      by: ['menuItemId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    const topDealIds = topSelling.map((row) => row.menuItemId);
    const topDealItems = topDealIds.length
      ? await this.prisma.branchMenuItem.findMany({
          where: {
            id: { in: topDealIds },
            isAvailable: true,
            branch: { status: BranchStatus.ACTIVE },
          },
          include: {
            ...this.menuInclude,
            branch: { include: { restaurant: true } },
          },
        })
      : await this.prisma.branchMenuItem.findMany({
          where: {
            isAvailable: true,
            branch: { status: BranchStatus.ACTIVE },
          },
          include: {
            ...this.menuInclude,
            branch: { include: { restaurant: true } },
          },
          take: 10,
          orderBy: { price: 'desc' },
        });

    const topDeals = topDealItems.map((item) =>
      this.mapMenuItem(item, item.branch.restaurant, {
        id: item.branch.id,
        name: item.branch.name,
      }),
    );

    return {
      featuredRestaurants,
      offers: offerItems.map((item) => ({
        ...this.mapMenuItem(item, item.branch.restaurant, {
          id: item.branch.id,
          name: item.branch.name,
        }),
        badge: 'LIMITED TIME',
        subtitle: `Valid at ${item.branch.restaurant.name}`,
      })),
      topDeals,
    };
  }

  async searchDishes(q: string, limit = 20) {
    if (!q?.trim()) {
      return [];
    }

    const items = await this.prisma.branchMenuItem.findMany({
      where: {
        isAvailable: true,
        branch: { status: BranchStatus.ACTIVE },
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      },
      include: {
        ...this.menuInclude,
        branch: { include: { restaurant: true } },
      },
      take: limit,
      orderBy: { name: 'asc' },
    });

    return items.map((item) =>
      this.mapMenuItem(item, item.branch.restaurant, {
        id: item.branch.id,
        name: item.branch.name,
      }),
    );
  }
}
