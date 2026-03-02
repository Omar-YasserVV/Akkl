import { Controller, Get } from '@nestjs/common';
import { MessagePattern, EventPattern, Payload } from '@nestjs/microservices';
import { SvcRestaurantService } from './svc-restaurant.service';
import { CreateRestaurantDto } from '@app/common/dtos/RestaurantDto/create.restaurant.dto';
import { UpdateRestaurantDto } from '@app/common/dtos/RestaurantDto/update.restaurant.dto';
@Controller()
export class SvcRestaurantController {
  constructor(private readonly svcRestaurantService: SvcRestaurantService) {}

  @MessagePattern('get-restaurants')
  async getRestaurants(@Payload() data: any) {
    return await this.svcRestaurantService.GetRestaurants();
  }

  @MessagePattern('create-restaurant')
  async createRestaurant(
    @Payload() data: { userId: number } & CreateRestaurantDto,
  ) {
    const { userId, ...restOfData } = data;
    return await this.svcRestaurantService.CreateRestaurant(userId, restOfData);
  }

  @MessagePattern('get-restaurant-by-id')
  async getRestaurantById(@Payload() data: { id: number }) {
    return await this.svcRestaurantService.GetRestaurantById(data.id);
  }

  @MessagePattern('get-restaurants-by-owner-id')
  async getRestaurantsByOwnerId(@Payload() data: { ownerId: number }) {
    return await this.svcRestaurantService.GetRestaurantsByOwnerId(
      data.ownerId,
    );
  }

  @MessagePattern('update-restaurant')
  async updateRestaurant(
    @Payload() data: { id: number } & UpdateRestaurantDto,
  ) {
    const { id, ...updateData } = data;
    return await this.svcRestaurantService.UpdateRestaurant(id, updateData);
  }

  @MessagePattern('delete-restaurant')
  async deleteRestaurant(@Payload() data: { id: number }) {
    return await this.svcRestaurantService.DeleteRestaurant(data.id);
  }
}
