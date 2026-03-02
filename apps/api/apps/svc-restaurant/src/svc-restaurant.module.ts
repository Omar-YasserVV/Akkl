import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SvcRestaurantController } from './svc-restaurant.controller';
import { SvcRestaurantService } from './svc-restaurant.service';
import { DbModule } from '@app/db';
import { PrismaService } from '@app/db';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    DbModule,
  ],
  controllers: [SvcRestaurantController],
  providers: [SvcRestaurantService, PrismaService],
})
export class SvcRestaurantModule {}
