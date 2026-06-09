import { DISCOVERY_TOPICS } from '@app/common/topics/discovery.topics';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DiscoveryService } from './discovery.service';

@Controller()
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @MessagePattern(DISCOVERY_TOPICS.HOME)
  discoverHome(@Payload() params: { lat?: number; lng?: number } = {}) {
    return this.discoveryService.discoverHome(params);
  }

  @MessagePattern(DISCOVERY_TOPICS.BRANCHES_NEARBY)
  discoverBranchesNearby(
    @Payload()
    params: {
      lat?: number;
      lng?: number;
      radiusKm?: number;
      restaurantId?: string;
      openNow?: boolean;
      q?: string;
    } = {},
  ) {
    return this.discoveryService.discoverBranchesNearby(params);
  }

  @MessagePattern(DISCOVERY_TOPICS.BRANCH_MENU)
  discoverBranchMenu(@Payload() params: { branchId: string }) {
    return this.discoveryService.discoverBranchMenu(params.branchId);
  }

  @MessagePattern(DISCOVERY_TOPICS.MENU_ITEM)
  discoverMenuItem(@Payload() params: { itemId: string }) {
    return this.discoveryService.discoverMenuItem(params.itemId);
  }

  @MessagePattern(DISCOVERY_TOPICS.SEARCH_DISHES)
  searchDishes(@Payload() params: { q?: string; limit?: number } = {}) {
    return this.discoveryService.searchDishes(params.q ?? '', params.limit);
  }
}
