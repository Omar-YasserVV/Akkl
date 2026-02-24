import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 9000;
  await app.listen(port);
  console.log(`the server is working on port:http://localhost:${port}`);
}
bootstrap();
