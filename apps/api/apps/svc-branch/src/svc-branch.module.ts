import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SvcBranchController } from './svc-branch.controller';
import { SvcBranchService } from './svc-branch.service';
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
  controllers: [SvcBranchController],
  providers: [SvcBranchService, PrismaService],
})

export class SvcBranchModule {}
