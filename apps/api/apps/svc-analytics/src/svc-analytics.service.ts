import { Injectable } from '@nestjs/common';

@Injectable()
export class SvcAnalyticsService {
  getHello(): string {
    return 'Hello World!';
  }
}
