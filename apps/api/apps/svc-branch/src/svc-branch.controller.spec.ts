import { Test, TestingModule } from '@nestjs/testing';
import { SvcBranchController } from './svc-branch.controller';
import { SvcBranchService } from './svc-branch.service';

describe('SvcBranchController', () => {
  let svcBranchController: SvcBranchController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SvcBranchController],
      providers: [SvcBranchService],
    }).compile();

    svcBranchController = app.get<SvcBranchController>(SvcBranchController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(svcBranchController.getHello()).toBe('Hello World!');
    });
  });
});
