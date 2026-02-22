import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SvcAuthModule } from './svc-auth.module';

async function bootstrap() {

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SvcAuthModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 9010,
      },
    },
  );
  await app.listen();
  console.log('svc-auth Microservice is listening...');
}
bootstrap();
