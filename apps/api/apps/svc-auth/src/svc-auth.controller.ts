import {
  Controller,
  Get,
  Post,
  Request,
  Response,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { SvcAuthService } from './svc-auth.service';
import { LoginDto, CreateUserDto, CompleteGoogleSignupDto } from '@app/common';

@Controller()
export class SvcAuthController {
  constructor(private readonly svcAuthService: SvcAuthService) {}

  @MessagePattern({ cmd: 'signup' })
  async signup(
    @Request() req,
    @Response() res,
    @Payload() CreateUserDto: CreateUserDto,
  ) {
    const result = await this.svcAuthService.signup(CreateUserDto);
    res.cookie('access_token', result?.access_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 7,
    });
    res.cookie('refresh_token', result?.refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.status(HttpStatus.CREATED).json({
      status: 'success',
      data: {
        user: result.user,
      },
    });
  }

  @MessagePattern({ cmd: 'login' })
  async login(@Request() req, @Response() res, @Payload() LoginDto: LoginDto) {
    const result = await this.svcAuthService.login(LoginDto);
    res.cookie('access_token', result?.access_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 7,
    });
    res.cookie('refresh_token', result?.refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.status(HttpStatus.OK).json({
      status: 'success',
      data: {
        user: result.user,
      },
    });
  }

  @MessagePattern({ cmd: 'google' })
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @MessagePattern({ cmd: 'google-callback' })
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res) {
    const user = req.user;

    if (user.tempToken) {
      return res.redirect(
        `http://localhost:5174/google-signup?token=${user.tempToken}`,
      );
    }
    res.cookie('access_token', user?.access_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 7,
    });
    res.cookie('refresh_token', user?.refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(HttpStatus.OK).json({
      status: 'success',
      data: user,
    });
  }

  @MessagePattern({ cmd: 'complete-google-signup' })
  async completeGoogleSignup(
    @Response() res,
    @Body() completeDto: CompleteGoogleSignupDto,
  ) {
    const newuser = await this.svcAuthService.finalizeGoogleSignup(completeDto);
    res.cookie('access_token', newuser?.access_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 7,
    });
    res.cookie('refresh_token', newuser?.refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.status(HttpStatus.OK).json({
      status: 'success',
      data: newuser,
    });
  }

  @MessagePattern({ cmd: 'forgot-password' })
  async forgotPassword(@Body('email') email: string) {
    return this.svcAuthService.forgotPassword(email);
  }

  @MessagePattern({ cmd: 'reset-password' })
  async resetPassword(@Body() resetDto: any) {
    return this.svcAuthService.verifyOtpAndReset(resetDto);
  }
}
