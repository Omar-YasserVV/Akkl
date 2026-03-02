import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SvcRestaurantModule } from './svc-restaurant.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SvcRestaurantModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 9011,
      },
    },
  );

  await app.listen();
  console.log('Restaurant Microservice is listening to TCP port 9011...');
}
bootstrap();
