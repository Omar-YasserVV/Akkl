import {
  CompleteGoogleSignupDto,
  CreateUserDto,
  LoginDto,
  tokenDto,
} from '@app/common';
import { BlackListService } from '@app/guards/services/blacklist.service';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GoogleUserDto, ResetPasswordDto } from '../dtos/auth.dto';
import { AuthResult, MessageResult } from './interfaces/auth.interface';
import { SvcAuthService } from './svc-auth.service';

@Controller()
export class SvcAuthController {
  constructor(
    private readonly svcAuthService: SvcAuthService,
    private readonly blackListService: BlackListService,
  ) {}

  @MessagePattern('signup')
  async signup(@Payload() data: CreateUserDto) {
    return this.svcAuthService.signup(data);
  }

  @MessagePattern('login')
  async login(@Payload() data: LoginDto) {
    return this.svcAuthService.login(data);
  }

  @MessagePattern('logout')
  async handleLogout(@Payload() data: tokenDto): Promise<{ success: boolean }> {
    await this.blackListService.pushBlacklistedToken(data);
    return { success: true };
  }

  @MessagePattern('google-callback')
  googleAuthCallback(@Payload() user: GoogleUserDto): GoogleUserDto {
    return user;
  }

  @MessagePattern('complete-google-signup')
  async completeGoogleSignup(
    @Payload() completeDto: CompleteGoogleSignupDto,
  ): Promise<AuthResult> {
    return this.svcAuthService.finalizeGoogleSignup(completeDto);
  }

  @MessagePattern('forgot-password')
  async forgotPassword(@Payload() email: string): Promise<MessageResult> {
    return this.svcAuthService.forgotPassword(email);
  }

  @MessagePattern('reset-password')
  async resetPassword(
    @Payload() resetDto: ResetPasswordDto,
  ): Promise<MessageResult> {
    return this.svcAuthService.verifyOtpAndReset(resetDto);
  }

  @MessagePattern('create-employee')
  async createEmployee(@Payload() data: CreateUserDto) {
    return this.svcAuthService.createEmployee(data);
  }

  @MessagePattern('get-employee-profile')
  async getEmployeeProfile(@Payload() id: number) {
    return this.svcAuthService.getEmployeeProfile(id);
  }
}
