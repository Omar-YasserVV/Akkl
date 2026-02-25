import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SvcAuthController } from './svc-auth.controller';
import { SvcAuthService } from './svc-auth.service';
import { GuardsModule } from '@app/guards';
import { BlackListService } from '@app/guards/services/blacklist.service';
import { DbModule } from '@app/db';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    DbModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION_TIME || ('7h' as any),
      },
    }),
    GuardsModule,
  ],
  controllers: [SvcAuthController],
  providers: [SvcAuthService, BlackListService],
})
export class SvcAuthModule {}
