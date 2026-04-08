import { DbModule, PrismaService } from '@app/db';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
  controllers: [MenuController],
  providers: [MenuService, PrismaService],
})
export class MenuModule {}
