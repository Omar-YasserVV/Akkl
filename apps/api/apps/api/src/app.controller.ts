import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response, Request } from 'express';
import { LoginDto, CreateUserDto } from '@app/common';
import { lastValueFrom } from 'rxjs';

@Controller('auth')
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  private setAuthCookies(res: Response, result: any) {
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

  @Post('signup')
  async signup(@Body() data: CreateUserDto, @Res() res: Response) {
    const result = await lastValueFrom(
      this.authService.send({ cmd: 'signup' }, data),
    );
    this.setAuthCookies(res, result);
    return res
      .status(HttpStatus.CREATED)
      .json({ status: 'success', data: { user: result.user } });
  }

  @Post('login')
  async login(@Body() data: LoginDto, @Res() res: Response) {
    const result = await lastValueFrom(
      this.authService.send({ cmd: 'login' }, data),
    );
    this.setAuthCookies(res, result);
    return res.status(HttpStatus.OK).json({ status: 'success', data: result });
  }

  @Post('logout')
  async logout(@Req() req: any, @Res() res: Response) {
    const refreshToken = req.cookies?.['refresh_token'];

    const result = await lastValueFrom(
      this.authService.send({ cmd: 'logout' }, { Token: refreshToken }),
    );

    res.clearCookie('access_token', { httpOnly: true, sameSite: 'strict' });
    res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'strict' });

    return res.status(HttpStatus.OK).json({ status: 'success', data: result });
  }

  @Post('complete-google-signup')
  async completeGoogleSignup(@Body() data: any, @Res() res: Response) {
    const result = await lastValueFrom(
      this.authService.send({ cmd: 'complete-google-signup' }, data),
    );
    this.setAuthCookies(res, result);
    return res.status(HttpStatus.OK).json({ status: 'success', data: result });
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.send({ cmd: 'forgot-password' }, email);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetDto: any) {
    return this.authService.send({ cmd: 'reset-password' }, resetDto);
  }
}
