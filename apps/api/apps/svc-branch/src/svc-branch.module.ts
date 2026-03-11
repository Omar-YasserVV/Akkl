import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SvcBranchController } from './svc-branch.controller';
import { SvcBranchService } from './svc-branch.service';
import { DbModule } from '@app/db';
import { PrismaService } from '@app/db';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    DbModule,
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
