import { Module } from '@nestjs/common';
import { SvcAuthController } from './svc-auth.controller';
import { SvcAuthService } from './svc-auth.service';

@Module({
  imports: [],
  controllers: [SvcAuthController],
  providers: [SvcAuthService],
})
export class SvcAuthModule {}
