import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

const authServiceHost = process.env.AUTH_SERVICE_HOST || '127.0.0.1';
const authServicePort = Number(process.env.AUTH_SERVICE_PORT || 9015);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: { host: authServiceHost, port: authServicePort },
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7h' },
    }),
  ],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
