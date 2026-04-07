import { CompleteGoogleSignupDto, CreateUserDto, LoginDto } from '@app/common';
import { BlackListService } from '@app/guards/services/blacklist.service';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GoogleUserDto, LogoutDto, ResetPasswordDto } from '../dtos/auth.dto';
import { SvcAuthService } from './svc-auth.service';
// import { tokenDto } from '@app/common/dtos/UserDto/token.dto';
// TODO: remove un used code //Abdo
// TODO: abdo fix this dtos i created file called auth.dto.ts in this folder make use the one time dto use there and the many uses in the common

@Controller()
export class SvcAuthController {
  constructor(
    private readonly svcAuthService: SvcAuthService,
    private readonly blackListService: BlackListService,
  ) {}

  @MessagePattern('signup')
  async signup(@Payload() data: CreateUserDto) {
    return await this.svcAuthService.signup(data);
  }

  @MessagePattern('login')
  async login(@Payload() data: LoginDto) {
    return await this.svcAuthService.login(data);
  }

  @MessagePattern('logout')
  async handleLogout(@Payload() data: LogoutDto) {
    if (data && data.Token) {
      await this.blackListService.pushBlacklistedToken(data);
    }

    return { success: true };
  }

  @MessagePattern('google-callback')
  googleAuthCallback(@Payload() user: GoogleUserDto) {
    return user;
  }

  @MessagePattern('complete-google-signup')
  async completeGoogleSignup(@Payload() completeDto: CompleteGoogleSignupDto) {
    return await this.svcAuthService.finalizeGoogleSignup(completeDto);
  }

  @MessagePattern('forgot-password')
  async forgotPassword(@Payload() email: string) {
    return this.svcAuthService.forgotPassword(email);
  }

  @MessagePattern('reset-password')
  async resetPassword(@Payload() resetDto: ResetPasswordDto) {
    return this.svcAuthService.verifyOtpAndReset(resetDto);
  }
}
