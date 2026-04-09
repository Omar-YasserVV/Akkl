import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SvcAuthModule } from './svc-auth.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SvcAuthModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9094'],
        },
        consumer: {
          groupId: 'svc-auth-server-group',
        },
      },
    },
  );
  await app.listen();
  console.log('svc-auth Microservice is listening...');
}
bootstrap();
