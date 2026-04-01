import { NestFactory } from '@nestjs/core';
import { SvcWarehouseModule } from './svc-warehouse.module';

async function bootstrap() {
  const app = await NestFactory.create(SvcWarehouseModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
