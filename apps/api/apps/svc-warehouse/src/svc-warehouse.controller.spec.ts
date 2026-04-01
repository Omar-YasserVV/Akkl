import { Test, TestingModule } from '@nestjs/testing';
import { SvcWarehouseController } from './svc-warehouse.controller';
import { SvcWarehouseService } from './svc-warehouse.service';

describe('SvcWarehouseController', () => {
  let svcWarehouseController: SvcWarehouseController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SvcWarehouseController],
      providers: [SvcWarehouseService],
    }).compile();

    svcWarehouseController = app.get<SvcWarehouseController>(SvcWarehouseController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(svcWarehouseController.getHello()).toBe('Hello World!');
    });
  });
});
