import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto } from '@app/common';
import { CreateUserDto } from '@app/common';

@Controller()
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  @Post('auth/signup')
  async signup(@Body() data: CreateUserDto) {
    console.log('worked from the signup');
    return this.authService.send({ cmd: 'signup' }, data);
  }

  @Post('auth/login')
  async login(@Body() data: LoginDto) {
    console.log('worked from the login');
    return this.authService.send({ cmd: 'login' }, data);
  }

  @Get('auth/google')
  async googleAuth() {
    return this.authService.send({ cmd: 'google' }, {});
  }

  @Get('auth/google/callback')
  async googleAuthCallback() {
    return this.authService.send({ cmd: 'google-callback' }, {});
  }

  @Post('auth/complete-google-signup')
  async completeGoogleSignup(@Body() data: any) {
    return this.authService.send({ cmd: 'complete-google-signup' }, data);
  }

  @Post('auth/forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.send({ cmd: 'forgot-password' }, email);
  }

  @Post('auth/reset-password')
  async resetPassword(@Body() resetDto: any) {
    return this.authService.send({ cmd: 'reset-password' }, resetDto);
  }
}
