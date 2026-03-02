import { Test, TestingModule } from '@nestjs/testing';
import { SvcRestaurantController } from './svc-restaurant.controller';
import { SvcRestaurantService } from './svc-restaurant.service';

describe('SvcRestaurantController', () => {
  let svcRestaurantController: SvcRestaurantController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SvcRestaurantController],
      providers: [SvcRestaurantService],
    }).compile();

    svcRestaurantController = app.get<SvcRestaurantController>(SvcRestaurantController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(svcRestaurantController.getHello()).toBe('Hello World!');
    });
  });
});
