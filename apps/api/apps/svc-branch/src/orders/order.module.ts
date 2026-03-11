import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class OrderModule {}
