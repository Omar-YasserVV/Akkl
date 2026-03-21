import { NestFactory } from '@nestjs/core';
import { SvcBranchModule } from './svc-branch.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SvcBranchModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9094'],
        },
        consumer: {
          groupId: 'svc-branch-server-group',
        },
      },
    },
  );
  await app.listen();
  console.log('svc-branch Microservice is listening...');
}
bootstrap();
