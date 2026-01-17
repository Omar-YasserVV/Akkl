import { Controller, Get } from '@nestjs/common';
import { SvcAuthService } from './svc-auth.service';

@Controller()
export class SvcAuthController {
  constructor(private readonly svcAuthService: SvcAuthService) {}

  @Get()
  getHello(): string {
    return this.svcAuthService.getHello();
  }
}
