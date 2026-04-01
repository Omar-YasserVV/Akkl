import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from '@app/db';
import { PrismaService } from '@app/db';
import { MenuService } from './menu.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
  ],
  controllers: [],
  providers: [MenuService, PrismaService],
})
export class MenuModule {}
