import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SvcRestaurantModule } from './svc-restaurant.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SvcRestaurantModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9094'],
        },
        consumer: {
          groupId: 'svc-restaurant-server-group',
        },
      },
    },
  );
  await app.listen();
  console.log('svc-restaurant Microservice is listening...');
}
bootstrap();
