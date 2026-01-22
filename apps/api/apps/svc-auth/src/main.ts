import { NestFactory } from '@nestjs/core';
import { SvcAuthModule } from './svc-auth.module';

async function bootstrap() {
  const app = await NestFactory.create(SvcAuthModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
