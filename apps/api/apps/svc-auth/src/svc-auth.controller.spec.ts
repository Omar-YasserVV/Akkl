import { Test, TestingModule } from '@nestjs/testing';
import { SvcAuthController } from './svc-auth.controller';
import { SvcAuthService } from './svc-auth.service';

describe('SvcAuthController', () => {
  let svcAuthController: SvcAuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SvcAuthController],
      providers: [SvcAuthService],
    }).compile();

    svcAuthController = app.get<SvcAuthController>(SvcAuthController);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(svcAuthController).toBeDefined();
    });
  });
});
