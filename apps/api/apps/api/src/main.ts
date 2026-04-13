import { RpcExceptionFilter } from '@app/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Gateway Service')
    .setDescription('API Gateway handling HTTP and Kafka events')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('Authentication')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(new RpcExceptionFilter());

  app.enableCors({
    origin: ['http://localhost:5173', 'app://-', '*'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use(cookieParser());

  const randomId = Math.random().toString(36).substring(7);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: { brokers: ['localhost:9094'] },
      consumer: {
        groupId: `gateway-broadcaster-${randomId}`,
      },
    },
  });

  await app.startAllMicroservices();
  const port = process.env.PORT || 9000;
  await app.listen(port);

  console.log(`🚀 HTTP Server: http://localhost:${port}`);
  console.log(`📄 Swagger Docs: http://localhost:${port}/api`);
}

void bootstrap();
