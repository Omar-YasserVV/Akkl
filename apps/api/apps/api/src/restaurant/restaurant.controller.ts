import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  HttpStatus,
  UseGuards,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response, Request } from 'express';
import { CreateRestaurantDto, UpdateRestaurantDto } from '@app/common';
import { lastValueFrom } from 'rxjs';
import { JwtAuthGuard } from '@app/guards/jwt-auth.guard';
import { RolesGuard } from '@app/guards/role.guard';
import { Roles } from '@app/guards/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('restaurants')
@Roles('BUSINESS_OWNER')
export class RestaurantController {
  constructor(
    @Inject('RESTAURANT_SERVICE')
    private readonly restaurantService: ClientProxy,
  ) {}

  @Get()
  async getRestaurants() {
    return await lastValueFrom(
      this.restaurantService.send('get-restaurants', {}),
    );
  }

  @Post()
  async createRestaurant(@Req() req: any, @Body() data: CreateRestaurantDto) {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User not found');
    }
    return await lastValueFrom(
      this.restaurantService.send('create-restaurant', { userId, ...data }),
    );
  }

  @Get(':id')
  async getRestaurantById(@Param('id') id: number) {
    return await lastValueFrom(
      this.restaurantService.send('get-restaurant-by-id', { id }),
    );
  }

  @Get('owner/:userId')
  async getRestaurantsByOwnerId(@Param('userId') userId: number) {
    return await lastValueFrom(
      this.restaurantService.send('get-restaurants-by-owner-id', { userId }),
    );
  }

  @Patch('update/:id')
  async updateRestaurant(
    @Param('id') id: number,
    @Body() data: UpdateRestaurantDto,
  ) {
    return await lastValueFrom(
      this.restaurantService.send('update-restaurant', { id, ...data }),
    );
  }

  @Delete('delete/:id')
  async deleteRestaurant(@Param('id') id: number) {
    return await lastValueFrom(
      this.restaurantService.send('delete-restaurant', { id }),
    );
  }
}
