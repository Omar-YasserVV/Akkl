import { DbModule } from '@app/db';
import { GuardsModule } from '@app/guards';
import { BlackListService } from '@app/guards/services/blacklist.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule } from '@nestjs/microservices';
import type { SignOptions } from 'jsonwebtoken';
import { createKafkaClient } from 'utils/kafka-client.factory';
import { SvcAuthController } from './svc-auth.controller';
import { SvcAuthService } from './svc-auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    DbModule,
    ClientsModule.registerAsync([
      createKafkaClient('AUTH_SERVICE', 'svc-auth-server-group', 'svc-auth'),
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRATION_TIME ??
          '7h') as SignOptions['expiresIn'],
      },
    }),
    GuardsModule,
  ],
  controllers: [SvcAuthController],
  providers: [SvcAuthService, BlackListService],
})
export class SvcAuthModule {}
