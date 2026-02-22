import { Body, Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto } from '@app/common';
import { CreateUserDto } from '@app/common';

@Controller()
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  async signup(@Body() data: CreateUserDto) {
    console.log('worked from the signup');
    return this.authService.send({ cmd: 'signup' }, data);
  }

  async login(@Body() data: LoginDto) {
    console.log('worked from the login');
    return this.authService.send({ cmd: 'login' }, data);
  }
}
