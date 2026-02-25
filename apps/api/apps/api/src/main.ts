import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RpcExceptionFilter } from '@app/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new RpcExceptionFilter());
  app.use(cookieParser());

  const port = process.env.PORT || 9000;
  await app.listen(port);
  console.log(`the server is working on port:http://localhost:${port}`);
}
bootstrap();
