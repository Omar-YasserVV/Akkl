import { Module } from '@nestjs/common';
import { GuardsService } from './guards.service';
import { BlackListService } from './services/blacklist.service';
import { DbModule, PrismaService } from '@app/db';

@Module({
  imports: [DbModule],
  providers: [GuardsService, BlackListService, PrismaService],
  exports: [GuardsService, BlackListService],
})
export class GuardsModule {}
