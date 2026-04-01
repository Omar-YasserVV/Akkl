import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from '@app/db';
import { PrismaService } from '@app/db';
<<<<<<< HEAD
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
=======
>>>>>>> e2dbb2951c2a80fa93e0a595787261c4499a231e
