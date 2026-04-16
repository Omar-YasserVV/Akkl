import {
  CompleteGoogleSignupDto,
  CreateStaffUserDto,
  LoginDto,
  SignupUserDto,
  tokenDto,
} from '@app/common';
import { AUTH_TOPICS } from '@app/common/topics/auth.topics';
import { BlackListService } from '@app/guards/services/blacklist.service';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ResetPasswordDto } from '../dtos/auth.dto';
import { AuthResult, MessageResult } from './interfaces/auth.interface';
import { SvcAuthService } from './svc-auth.service';

@Controller()
export class SvcAuthController {
  constructor(
    private readonly svcAuthService: SvcAuthService,
    private readonly blackListService: BlackListService,
  ) {}

  @MessagePattern(AUTH_TOPICS.SIGNUP)
  async signup(@Payload() data: SignupUserDto) {
    return this.svcAuthService.signup(data);
  }

  @MessagePattern(AUTH_TOPICS.LOGIN)
  async login(@Payload() data: LoginDto) {
    return this.svcAuthService.login(data);
  }

  @MessagePattern(AUTH_TOPICS.LOGOUT)
  async handleLogout(@Payload() data: tokenDto): Promise<{ success: boolean }> {
    await this.blackListService.pushBlacklistedToken(data);
    return { success: true };
  }

  // @MessagePattern('google-callback')
  // googleAuthCallback(@Payload() user: GoogleUserDto): GoogleUserDto {
  //   return user;
  // }

  @MessagePattern(AUTH_TOPICS.COMPLETE_GOOGLE_SIGNUP)
  async completeGoogleSignup(
    @Payload() completeDto: CompleteGoogleSignupDto,
  ): Promise<AuthResult> {
    return this.svcAuthService.finalizeGoogleSignup(completeDto);
  }

  @MessagePattern(AUTH_TOPICS.FORGOT_PASSWORD)
  async forgotPassword(@Payload() email: string): Promise<MessageResult> {
    return this.svcAuthService.forgotPassword(email);
  }

  @MessagePattern(AUTH_TOPICS.RESET_PASSWORD)
  async resetPassword(
    @Payload() resetDto: ResetPasswordDto,
  ): Promise<MessageResult> {
    return this.svcAuthService.verifyOtpAndReset(resetDto);
  }

  @MessagePattern(AUTH_TOPICS.CREATE_EMPLOYEE)
  async createEmployee(@Payload() data: CreateStaffUserDto) {
    return this.svcAuthService.createEmployee(data);
  }

  @MessagePattern(AUTH_TOPICS.GET_USER_PROFILE)
  async getEmployeeProfile(@Payload() id: string) {
    return this.svcAuthService.getUserProfile(id);
  }
}
