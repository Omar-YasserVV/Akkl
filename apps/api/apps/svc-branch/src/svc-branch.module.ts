import { DbModule } from '@app/db';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { createKafkaClient } from 'utils/kafka-client.factory';
import { MenuModule } from './menu/menu.module';
import { OrderModule } from './orders/order.module';
import { SvcBranchController } from './svc-branch.controller';
import { SvcBranchService } from './svc-branch.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    DbModule,
    MenuModule,
    OrderModule,
    ClientsModule.registerAsync([
      createKafkaClient(
        'BRANCH_SERVICE',
        'svc-branch-server-group',
        'svc-branch',
      ),
    ]),
  ],
  controllers: [SvcBranchController],
  providers: [SvcBranchService],
})
export class SvcBranchModule {}
