import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SvcAnalyticsModule } from './svc-analytics.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SvcAnalyticsModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9094'],
        },
        consumer: {
          groupId: 'svc-analytics-server-group',
        },
      },
    },
  );
  await app.listen();
  console.log('svc-analytics Microservice is listening...');
}
bootstrap();
