import { CreateRestaurantDto, UpdateRestaurantDto } from '@app/common';
import { RESTAURANT_TOPICS } from '@app/common/topics/restaurant.topics';
import { JwtAuthGuard } from '@app/guards/jwt-auth.guard';
import { RolesGuard } from '@app/guards/role.guard';
import { Roles } from '@app/guards/roles.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { UserRole } from 'libs/db/generated/client/enums';
import { lastValueFrom } from 'rxjs';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('restaurants')
@Roles(UserRole.BUSINESS_OWNER)
export class RestaurantController implements OnModuleInit {
  constructor(
    @Inject('RESTAURANT_SERVICE')
    private readonly restaurantClient: ClientKafka,
  ) {}

  async onModuleInit() {
    Object.values(RESTAURANT_TOPICS).forEach((topic) => {
      this.restaurantClient.subscribeToResponseOf(topic);
    });

    await this.restaurantClient.connect();
  }

  @Get()
  async getRestaurants() {
    return await lastValueFrom(
      this.restaurantClient.send('get-restaurants', {}),
    );
  }

  @Post()
  async createRestaurant(@Req() req: any, @Body() data: CreateRestaurantDto) {
    const userId = req.user?.sub ?? req.user?.id;
    if (!userId) {
      throw new Error('User not found');
    }
    return await lastValueFrom(
      this.restaurantClient.send('create-restaurant', { userId, ...data }),
    );
  }

  @Get(':id')
  async getRestaurantById(@Param('id') id: string) {
    return await lastValueFrom(
      this.restaurantClient.send('get-restaurant-by-id', { id }),
    );
  }

  @Get('owner/:userId')
  async getRestaurantsByOwnerId(@Param('userId') userId: string) {
    return await lastValueFrom(
      this.restaurantClient.send('get-restaurants-by-owner-id', { userId }),
    );
  }

  @Patch('update/:id')
  async updateRestaurant(
    @Param('id') id: string,
    @Body() data: UpdateRestaurantDto,
  ) {
    return await lastValueFrom(
      this.restaurantClient.send('update-restaurant', { id, ...data }),
    );
  }

  @Delete('delete/:id')
  async deleteRestaurant(@Param('id') id: string) {
    return await lastValueFrom(
      this.restaurantClient.send('delete-restaurant', { id }),
    );
  }
}
