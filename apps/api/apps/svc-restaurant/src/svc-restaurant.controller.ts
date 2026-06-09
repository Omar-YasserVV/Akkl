import { CreateRestaurantDto } from '@app/common/dtos/RestaurantDto/create.restaurant.dto';
import { UpdateRestaurantDto } from '@app/common/dtos/RestaurantDto/update.restaurant.dto';
import { DISCOVERY_TOPICS } from '@app/common/topics/discovery.topics';
import { RESTAURANT_TOPICS } from '@app/common/topics/restaurant.topics';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SvcRestaurantService } from './svc-restaurant.service';
@Controller()
export class SvcRestaurantController {
  constructor(private readonly svcRestaurantService: SvcRestaurantService) {}

  @MessagePattern(RESTAURANT_TOPICS.GET_RESTAURANTS)
  async getRestaurants() {
    return await this.svcRestaurantService.GetRestaurants();
  }

  @MessagePattern(RESTAURANT_TOPICS.CREATE_RESTAURANT)
  async createRestaurant(
    @Payload() data: { userId: string } & CreateRestaurantDto,
  ) {
    const { userId, ...restOfData } = data;
    return await this.svcRestaurantService.CreateRestaurant(userId, restOfData);
  }

  @MessagePattern(RESTAURANT_TOPICS.GET_RESTAURANT_BY_ID)
  async getRestaurantById(@Payload() data: { id: string }) {
    return await this.svcRestaurantService.GetRestaurantById(data.id);
  }

  @MessagePattern(RESTAURANT_TOPICS.GET_RESTAURANTS_BY_OWNER_ID)
  async getRestaurantsByOwnerId(@Payload() data: { ownerId: string }) {
    return await this.svcRestaurantService.GetRestaurantsByOwnerId(
      data.ownerId,
    );
  }

  @MessagePattern(RESTAURANT_TOPICS.UPDATE_RESTAURANT)
  async updateRestaurant(
    @Payload() data: { id: string } & UpdateRestaurantDto,
  ) {
    const { id, ...updateData } = data;
    return await this.svcRestaurantService.UpdateRestaurant(id, updateData);
  }

  @MessagePattern(RESTAURANT_TOPICS.DELETE_RESTAURANT)
  async deleteRestaurant(@Payload() data: { id: string }) {
    return await this.svcRestaurantService.DeleteRestaurant(data.id);
  }

  @MessagePattern(DISCOVERY_TOPICS.RESTAURANTS)
  discoverRestaurants(
    @Payload()
    params: {
      page?: number;
      limit?: number;
      q?: string;
      lat?: number;
      lng?: number;
    },
  ) {
    return this.svcRestaurantService.discoverRestaurants(params);
  }

  @MessagePattern(DISCOVERY_TOPICS.RESTAURANT_BY_ID)
  discoverRestaurantById(
    @Payload() params: { id: string; lat?: number; lng?: number },
  ) {
    return this.svcRestaurantService.discoverRestaurantById(
      params.id,
      params.lat,
      params.lng,
    );
  }

  @MessagePattern(DISCOVERY_TOPICS.SEARCH_RESTAURANTS)
  searchRestaurants(@Payload() params: { q: string; limit?: number }) {
    return this.svcRestaurantService.searchRestaurants(params.q, params.limit);
  }
}
