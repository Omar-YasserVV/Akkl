import { ConfigService } from '@nestjs/config';
import { ClientsModuleAsyncOptions, Transport } from '@nestjs/microservices';

export const createKafkaClient = (
  name: string,
  groupId: string,
): ClientsModuleAsyncOptions => [
  {
    name,
    useFactory: (configService: ConfigService) => ({
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [
            configService.get<string>('KAFKA_BROKER') ?? 'localhost:9094',
          ],
        },
        consumer: {
          groupId,
          allowAutoTopicCreation: true,
          sessionTimeout: 6000,
          heartbeatInterval: 2000,
        },
      },
    }),
    inject: [ConfigService],
  },
];
