import { Test, TestingModule } from '@nestjs/testing';
import { SvcAnalyticsController } from './svc-analytics.controller';
import { SvcAnalyticsService } from './svc-analytics.service';

describe('SvcAnalyticsController', () => {
  let svcAnalyticsController: SvcAnalyticsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SvcAnalyticsController],
      providers: [SvcAnalyticsService],
    }).compile();

    svcAnalyticsController = app.get<SvcAnalyticsController>(SvcAnalyticsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(svcAnalyticsController.getHello()).toBe('Hello World!');
    });
  });
});
