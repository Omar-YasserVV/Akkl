import {
  Controller,
  Get,
  Post,
  Request,
  Response,
  Body,
  UsePipes,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SvcAuthService } from './svc-auth.service';
import { CreateUserDto } from '@app/common';
import { LoginDto } from '@app/common';

@Controller()
export class SvcAuthController {
  constructor(private readonly svcAuthService: SvcAuthService) {}

  @MessagePattern({ cmd: 'signup' })
  @Post('signup')
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
  }

  @MessagePattern({ cmd: 'login' })
  @Post('login')
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
  }
}
