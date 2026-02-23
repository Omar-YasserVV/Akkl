import { Module } from '@nestjs/common';
import { SvcAuthController } from './svc-auth.controller';
import { SvcAuthService } from './svc-auth.service';
import { DbModule } from '@app/db';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    DbModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION_TIME || ('7h' as any),
      },
    }),
  ],
  controllers: [SvcAuthController],
  providers: [SvcAuthService],
})
export class SvcAuthModule {}
