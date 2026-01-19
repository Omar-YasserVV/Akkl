import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
@Controller()
export class AppController {
  constructor(
    @Inject('CREATE_POST_SERVICE') private readonly createClient: ClientProxy,
  ) {}

  @Get()
  getHello() {
    return this.createClient.send({ cmd: 'get_hello' }, {});
  }
}
