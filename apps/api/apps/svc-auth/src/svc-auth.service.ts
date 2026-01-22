import { Injectable } from '@nestjs/common';

@Injectable()
export class SvcAuthService {
  getHello(): string {
    return 'Hello World!';
  }
}
