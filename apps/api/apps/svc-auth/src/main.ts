import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SvcAuthModule } from './svc-auth.module';

async function bootstrap() {
  const authHost = process.env.AUTH_SERVICE_HOST || '127.0.0.1';
  const authPort = Number(process.env.AUTH_SERVICE_PORT || 9015);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SvcAuthModule,
    {
      transport: Transport.TCP,
      options: {
        host: authHost,
        port: authPort,
      },
    },
  );
  await app.listen();
  console.log(`svc-auth Microservice is listening on ${authHost}:${authPort}...`);
}
void bootstrap();
