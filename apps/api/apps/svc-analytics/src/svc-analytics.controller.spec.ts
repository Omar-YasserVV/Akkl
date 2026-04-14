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

  describe('ping', () => {
    it('should return chart-ready analytics response', () => {
      const response = svcAnalyticsController.ping({ groupBy: 'day' });
      expect(response.groupBy).toBe('day');
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });
  });
});
