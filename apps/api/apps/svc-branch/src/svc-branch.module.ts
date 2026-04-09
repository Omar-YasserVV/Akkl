import { DbModule, PrismaService } from '@app/db';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
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
    ClientsModule.register([
      {
        name: 'BRANCH_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9094'],
          },
          consumer: {
            groupId:
              'branch-event-producer-client' +
              Math.random().toString(36).substring(7),
            allowAutoTopicCreation: true,
            sessionTimeout: 6000,
            heartbeatInterval: 2000,
          },
        },
      },
    ]),
  ],
  controllers: [SvcBranchController],
  providers: [SvcBranchService, PrismaService],
})
export class SvcBranchModule {}
