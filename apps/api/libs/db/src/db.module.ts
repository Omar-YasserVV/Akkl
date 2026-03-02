import { Module, Global } from '@nestjs/common';
import { DbService } from './db.service';
import { PrismaService } from './prisma.service';
@Global()
@Module({
  providers: [DbService, PrismaService],
  exports: [DbService, PrismaService],
})
export class DbModule {}
