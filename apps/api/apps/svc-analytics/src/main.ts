import { NestFactory } from '@nestjs/core';
import { SvcAnalyticsModule } from './svc-analytics.module';

async function bootstrap() {
  const app = await NestFactory.create(SvcAnalyticsModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
