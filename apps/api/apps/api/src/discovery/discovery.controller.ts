import { DISCOVERY_TOPICS } from '@app/common/topics/discovery.topics';
import { JwtAuthGuard } from '@app/guards/jwt-auth.guard';
import {
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@UseGuards(JwtAuthGuard)
@Controller('discovery')
export class DiscoveryController implements OnModuleInit {
  constructor(
    @Inject('RESTAURANT_SERVICE')
    private readonly restaurantClient: ClientKafka,
    @Inject('BRANCH_SERVICE')
    private readonly branchClient: ClientKafka,
  ) {}

  async onModuleInit() {
    Object.values(DISCOVERY_TOPICS).forEach((topic) => {
      if (
        topic === DISCOVERY_TOPICS.HOME ||
        topic === DISCOVERY_TOPICS.BRANCHES_NEARBY ||
        topic === DISCOVERY_TOPICS.BRANCH_MENU ||
        topic === DISCOVERY_TOPICS.MENU_ITEM ||
        topic === DISCOVERY_TOPICS.SEARCH_DISHES
      ) {
        this.branchClient.subscribeToResponseOf(topic);
      } else {
        this.restaurantClient.subscribeToResponseOf(topic);
      }
    });

    await Promise.all([
      this.restaurantClient.connect(),
      this.branchClient.connect(),
    ]);
  }

  @Get('home')
  getHome(@Query('lat') lat?: string, @Query('lng') lng?: string) {
    return lastValueFrom(
      this.branchClient.send(DISCOVERY_TOPICS.HOME, {
        lat: lat ? Number(lat) : undefined,
        lng: lng ? Number(lng) : undefined,
      }),
    );
  }

  @Get('restaurants')
  getRestaurants(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('q') q?: string,
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
  ) {
    return lastValueFrom(
      this.restaurantClient.send(DISCOVERY_TOPICS.RESTAURANTS, {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        q,
        lat: lat ? Number(lat) : undefined,
        lng: lng ? Number(lng) : undefined,
      }),
    );
  }

  @Get('restaurants/:id')
  getRestaurantById(
    @Param('id') id: string,
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
  ) {
    return lastValueFrom(
      this.restaurantClient.send(DISCOVERY_TOPICS.RESTAURANT_BY_ID, {
        id,
        lat: lat ? Number(lat) : undefined,
        lng: lng ? Number(lng) : undefined,
      }),
    );
  }

  @Get('branches/nearby')
  getBranchesNearby(
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
    @Query('radiusKm') radiusKm?: string,
    @Query('restaurantId') restaurantId?: string,
    @Query('openNow') openNow?: string,
    @Query('q') q?: string,
  ) {
    return lastValueFrom(
      this.branchClient.send(DISCOVERY_TOPICS.BRANCHES_NEARBY, {
        lat: lat ? Number(lat) : undefined,
        lng: lng ? Number(lng) : undefined,
        radiusKm: radiusKm ? Number(radiusKm) : undefined,
        restaurantId,
        openNow: openNow === 'true',
        q,
      }),
    );
  }

  @Get('branches/:branchId/menu')
  getBranchMenu(@Param('branchId') branchId: string) {
    return lastValueFrom(
      this.branchClient.send(DISCOVERY_TOPICS.BRANCH_MENU, { branchId }),
    );
  }

  @Get('menu/:itemId')
  getMenuItem(@Param('itemId') itemId: string) {
    return lastValueFrom(
      this.branchClient.send(DISCOVERY_TOPICS.MENU_ITEM, { itemId }),
    );
  }

  @Get('search')
  async search(@Query('q') q?: string, @Query('limit') limit?: string) {
    const [restaurants, dishes] = await Promise.all([
      lastValueFrom(
        this.restaurantClient.send(DISCOVERY_TOPICS.SEARCH_RESTAURANTS, {
          q: q ?? '',
          limit: limit ? Number(limit) : undefined,
        }),
      ),
      lastValueFrom(
        this.branchClient.send(DISCOVERY_TOPICS.SEARCH_DISHES, {
          q: q ?? '',
          limit: limit ? Number(limit) : undefined,
        }),
      ),
    ]);

    return { restaurants, dishes };
  }
}
