import { RpcExceptionFilter } from '@app/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser'; // Try standard default import first
import type { RequestHandler } from 'express';
import { AppModule } from './app.module';
import { setupOrpc } from './orpc/setup-orpc';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Swagger Setup
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
    origin: true, // or specify 'http://localhost:5173'
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // If "cookieParser is not a function" persists, change to: (cookieParser as any)()
  const cookieParserMiddleware =
    cookieParser as unknown as () => RequestHandler;
  app.use(cookieParserMiddleware());

  await setupOrpc(app);

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
  console.log(`⚡ oRPC Endpoint: http://localhost:${port}/orpc`);
}

void bootstrap();
