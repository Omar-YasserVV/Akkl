import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from '@app/db';
import { CreateRestaurantDto } from '@app/common/dtos/RestaurantDto/create.restaurant.dto';
import { UpdateRestaurantDto } from '@app/common/dtos/RestaurantDto/update.restaurant.dto';

@Injectable()
export class SvcRestaurantService {
  constructor(private readonly prisma: PrismaService) {}
  async CreateRestaurant(userId: number, data: CreateRestaurantDto) {
    const ownerId = Number(userId);

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

  async GetRestaurantsByOwnerId(ownerId: number) {
    return await this.prisma.restaurant.findMany({
      where: { ownerId },
    });
  }

  async GetRestaurantById(id: number) {
    return await this.prisma.restaurant.findUnique({
      where: { id },
    });
  }

  async UpdateRestaurant(id: number, data: UpdateRestaurantDto) {
    return await this.prisma.restaurant.update({
      where: { id },
      data,
    });
  }

  async DeleteRestaurant(id: number) {
    return await this.prisma.restaurant.delete({
      where: { id },
    });
  }
}
