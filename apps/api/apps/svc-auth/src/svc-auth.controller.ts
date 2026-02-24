import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SvcAuthService } from './svc-auth.service';
import { LoginDto, CreateUserDto, CompleteGoogleSignupDto } from '@app/common';

@Controller()
export class SvcAuthController {
  constructor(private readonly svcAuthService: SvcAuthService) {}

  @MessagePattern({ cmd: 'signup' })
  async signup(@Payload() data: CreateUserDto) {
    // Logic only. No res.cookie here!
    return await this.svcAuthService.signup(data);
  }

  @MessagePattern({ cmd: 'login' })
  async login(@Payload() data: LoginDto) {
    return await this.svcAuthService.login(data);
  }

  @MessagePattern({ cmd: 'google-callback' })
  async googleAuthCallback(@Payload() user: any) {
    // Passport logic usually happens at the Gateway level, 
    // but if handled here, just return the user object.
    return user;
  }

  @MessagePattern({ cmd: 'complete-google-signup' })
  async completeGoogleSignup(@Payload() completeDto: CompleteGoogleSignupDto) {
    return await this.svcAuthService.finalizeGoogleSignup(completeDto);
  }

  @MessagePattern({ cmd: 'forgot-password' })
  async forgotPassword(@Payload() email: string) {
    return this.svcAuthService.forgotPassword(email);
  }

  @MessagePattern({ cmd: 'reset-password' })
  async resetPassword(@Payload() resetDto: any) {
    return this.svcAuthService.verifyOtpAndReset(resetDto);
  }
}