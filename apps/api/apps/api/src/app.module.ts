import { ConfigurableModuleBuilder, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 9010 },
      },
      // {
      //   name: 'KAFKA_SERVICE',
      //   transport: Transport.KAFKA,
      //   options: {
      //     client: {
      //       brokers: ['localhost:9001'],
      //     },
      //     consumer: {
      //       groupId: 'svc-auth-consumer',
      //     },
      //   },
      // },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
