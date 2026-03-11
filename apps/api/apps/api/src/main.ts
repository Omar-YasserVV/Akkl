import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RpcExceptionFilter } from '@app/common';
import cookieParser from 'cookie-parser';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new RpcExceptionFilter());
  app.use(cookieParser());
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: { brokers: ['localhost:9094'] },
      consumer: {
        groupId:
          'gateway-broadcaster-' + Math.random().toString(36).substring(7),
      },
    },
  });

  await app.startAllMicroservices();
  const port = process.env.PORT || 9000;
  await app.listen(port);
  console.log(`the server is working on port:http://localhost:${port}`);
}
bootstrap();
