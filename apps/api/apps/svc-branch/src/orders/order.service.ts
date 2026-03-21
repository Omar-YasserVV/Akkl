import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/db';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(restaurantId: number, data: any) {
    
  }
}
