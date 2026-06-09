import { CreateRestaurantDto } from '@app/common/dtos/RestaurantDto/create.restaurant.dto';
import { UpdateRestaurantDto } from '@app/common/dtos/RestaurantDto/update.restaurant.dto';
import { PrismaService } from '@app/db';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { BranchStatus } from 'libs/db/generated/client/client';
import {
  formatCategoryLabel,
  getBranchOpenStatus,
  haversineKm,
} from 'utils/discovery.util';
import { createPagination } from 'utils/pagination.util';

@Injectable()
export class SvcRestaurantService {
  constructor(private readonly prisma: PrismaService) {}

  async CreateRestaurant(userId: string, data: CreateRestaurantDto) {
    const ownerId = userId;

    const user = await this.prisma.user.findUnique({
      where: { id: ownerId },
    });

    if (!user) {
      throw new RpcException({ message: 'User not found', status: 404 });
    }

    const existingRestaurant = await this.prisma.restaurant.findUnique({
      where: { name: data.name },
    });

    if (existingRestaurant) {
      throw new RpcException({
        message: 'Restaurant with this name already exists',
        status: 400,
      });
    }

    return await this.prisma.restaurant.create({
      data: {
        name: data.name,
        logoUrl: data.logoUrl,
        ownerId: ownerId,
      },
    });
  }

  async GetRestaurants() {
    return await this.prisma.restaurant.findMany({
      include: {
        branches: true,
      },
    });
  }

  async GetRestaurantsByOwnerId(ownerId: string) {
    return await this.prisma.restaurant.findMany({
      where: { ownerId },
    });
  }

  async GetRestaurantById(id: string) {
    return await this.prisma.restaurant.findUnique({
      where: { id },
    });
  }

  async UpdateRestaurant(id: string, data: UpdateRestaurantDto) {
    return await this.prisma.restaurant.update({
      where: { id },
      data,
    });
  }

  async DeleteRestaurant(id: string) {
    return await this.prisma.restaurant.delete({
      where: { id },
    });
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

  private mapRestaurantSummary(
    restaurant: {
      id: string;
      name: string;
      logoUrl: string | null;
      branches: Array<{
        id: string;
        name: string;
        address: string | null;
        latitude: number | null;
        longitude: number | null;
        weeklyHours: unknown;
        status: BranchStatus;
      }>;
    },
    cuisineLabel: string,
    lat?: number,
    lng?: number,
  ) {
    const branchesWithDistance = restaurant.branches
      .map((branch) => ({
        branch,
        distanceKm:
          lat != null &&
          lng != null &&
          branch.latitude != null &&
          branch.longitude != null
            ? haversineKm(lat, lng, branch.latitude, branch.longitude)
            : null,
      }))
      .sort(
        (a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity),
      );

    const nearest = branchesWithDistance[0]?.branch;
    const openInfo = nearest
      ? getBranchOpenStatus(nearest.weeklyHours)
      : { status: 'OPEN' as const };

    return {
      id: restaurant.id,
      name: restaurant.name,
      logoUrl: restaurant.logoUrl,
      cuisineLabel,
      branchCount: restaurant.branches.length,
      nearestBranch: nearest
        ? {
            id: nearest.id,
            name: nearest.name,
            address: nearest.address,
            distanceKm: branchesWithDistance[0]?.distanceKm ?? null,
            openStatus: openInfo.status,
            openUntil: openInfo.until,
          }
        : null,
    };
  }

  async discoverRestaurants(params: {
    page?: number;
    limit?: number;
    q?: string;
    lat?: number;
    lng?: number;
  }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {
      branches: { some: { status: BranchStatus.ACTIVE } },
      ...(params.q
        ? { name: { contains: params.q, mode: 'insensitive' as const } }
        : {}),
    };

    const [restaurants, total] = await Promise.all([
      this.prisma.restaurant.findMany({
        where,
        include: {
          branches: { where: { status: BranchStatus.ACTIVE } },
        },
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.restaurant.count({ where }),
    ]);

    const data = await Promise.all(
      restaurants.map(async (restaurant) =>
        this.mapRestaurantSummary(
          restaurant,
          await this.getCuisineLabel(restaurant.id),
          params.lat,
          params.lng,
        ),
      ),
    );

    return createPagination(data, total, page, limit);
  }

  async discoverRestaurantById(id: string, lat?: number, lng?: number) {
    const restaurant = await this.prisma.restaurant.findFirst({
      where: {
        id,
        branches: { some: { status: BranchStatus.ACTIVE } },
      },
      include: {
        branches: { where: { status: BranchStatus.ACTIVE } },
      },
    });

    if (!restaurant) {
      throw new RpcException({ message: 'Restaurant not found', status: 404 });
    }

    const cuisineLabel = await this.getCuisineLabel(restaurant.id);

    const branches = restaurant.branches
      .map((branch) => {
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
          openStatus: openInfo.status,
          openUntil: openInfo.until,
          distanceKm,
        };
      })
      .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));

    return {
      ...this.mapRestaurantSummary(
        restaurant,
        cuisineLabel,
        lat,
        lng,
      ),
      branches,
    };
  }

  async searchRestaurants(q: string, limit = 20) {
    if (!q?.trim()) {
      return [];
    }

    const restaurants = await this.prisma.restaurant.findMany({
      where: {
        name: { contains: q, mode: 'insensitive' },
        branches: { some: { status: BranchStatus.ACTIVE } },
      },
      include: {
        branches: { where: { status: BranchStatus.ACTIVE } },
      },
      take: limit,
      orderBy: { name: 'asc' },
    });

    return Promise.all(
      restaurants.map(async (restaurant) =>
        this.mapRestaurantSummary(
          restaurant,
          await this.getCuisineLabel(restaurant.id),
        ),
      ),
    );
  }
}
