import {
  Controller,
  Request,
  Response,
  UnauthorizedException,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SvcAuthService } from './svc-auth.service';
import { LoginDto, CreateUserDto, CompleteGoogleSignupDto } from '@app/common';
import { BlackListService } from '@app/guards/services/blacklist.service';
import { tokenDto } from '@app/common/dtos/UserDto/token.dto';
@Controller()
export class SvcAuthController {
  constructor(
    private readonly svcAuthService: SvcAuthService,
    private readonly blackListService: BlackListService,
  ) {}

  @MessagePattern({ cmd: 'signup' })
  async signup(@Payload() data: CreateUserDto) {
    return await this.svcAuthService.signup(data);
  }

  @MessagePattern({ cmd: 'login' })
  async login(@Payload() data: LoginDto) {
    return await this.svcAuthService.login(data);
  }

  @MessagePattern({ cmd: 'logout' })
  async handleLogout(@Payload() data: any) {
    if (data && data.Token) {
      await this.blackListService.pushBlacklistedToken(data);
    }

    return { success: true };
  }

  @MessagePattern({ cmd: 'google-callback' })
  async googleAuthCallback(@Payload() user: any) {
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
