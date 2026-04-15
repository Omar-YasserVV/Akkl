import { CreateRestaurantDto } from '@app/common/dtos/RestaurantDto/create.restaurant.dto';
import { UpdateRestaurantDto } from '@app/common/dtos/RestaurantDto/update.restaurant.dto';
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
    @Payload() data: { userId: number } & CreateRestaurantDto,
  ) {
    const { userId, ...restOfData } = data;
    return await this.svcRestaurantService.CreateRestaurant(userId, restOfData);
  }

  @MessagePattern(RESTAURANT_TOPICS.GET_RESTAURANT_BY_ID)
  async getRestaurantById(@Payload() data: { id: number }) {
    return await this.svcRestaurantService.GetRestaurantById(data.id);
  }

  @MessagePattern(RESTAURANT_TOPICS.GET_RESTAURANTS_BY_OWNER_ID)
  async getRestaurantsByOwnerId(@Payload() data: { ownerId: number }) {
    return await this.svcRestaurantService.GetRestaurantsByOwnerId(
      data.ownerId,
    );
  }

  @MessagePattern(RESTAURANT_TOPICS.UPDATE_RESTAURANT)
  async updateRestaurant(
    @Payload() data: { id: number } & UpdateRestaurantDto,
  ) {
    const { id, ...updateData } = data;
    return await this.svcRestaurantService.UpdateRestaurant(id, updateData);
  }

  @MessagePattern(RESTAURANT_TOPICS.DELETE_RESTAURANT)
  async deleteRestaurant(@Payload() data: { id: number }) {
    return await this.svcRestaurantService.DeleteRestaurant(data.id);
  }
}
