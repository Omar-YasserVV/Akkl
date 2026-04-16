import { BlackListService } from '@app/guards/services/blacklist.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule } from '@nestjs/microservices';
import { createKafkaClient } from 'utils/kafka-client.factory';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ClientsModule.registerAsync([
      createKafkaClient(
        'AUTH_SERVICE',
        'api-gateway-auth-group',
        'api-gateway-auth',
      ),
    ]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '7h' },
      }),
      inject: [ConfigService],
    }),
  ],

  controllers: [AuthController],
  providers: [BlackListService],
})
export class AuthModule {}
