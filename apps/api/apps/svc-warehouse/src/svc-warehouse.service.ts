import { Injectable } from '@nestjs/common';

@Injectable()
export class SvcWarehouseService {
  getHello(): string {
    return 'Hello World!';
  }
}
