import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class OrderController {
  constructor() {}
  @MessagePattern('create-order')
  createOrder(@Payload() data: any) {}
}
