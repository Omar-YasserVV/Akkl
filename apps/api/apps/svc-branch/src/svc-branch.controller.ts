import {
  InitializeBranchDto,
  UpdateBranchDto,
  UpdateOnboardingDto,
} from '@app/common';
import { BRANCH_TOPICS } from '@app/common/topics/branch.topics';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SvcBranchService } from './svc-branch.service';

@Controller()
export class SvcBranchController {
  constructor(private readonly svcBranchService: SvcBranchService) {}

  // ─── PHASE 1: INITIALIZE DRAFT ──────────────────────────────────────────
  @MessagePattern(BRANCH_TOPICS.INITIALIZE)
  async initializeBranch(
    @Payload() data: { restaurantId: string; dto: InitializeBranchDto },
  ) {
    return await this.svcBranchService.initializeBranch(
      data.restaurantId,
      data.dto,
    );
  }

  // ─── PHASE 2: SAVE WIZARD PROGRESS ──────────────────────────────────────
  @MessagePattern(BRANCH_TOPICS.UPDATE_ONBOARDING)
  async updateOnboardingProgress(
    @Payload()
    { branchId, data }: { branchId: string; data: UpdateOnboardingDto },
  ) {
    return await this.svcBranchService.updateOnboardingProgress(branchId, data);
  }

  // ─── PHASE 3: COMPLETE SETUP ────────────────────────────────────────────
  @MessagePattern(BRANCH_TOPICS.FINALIZE)
  async finalizeBranch(
    @Payload()
    { branchId }: { branchId: string },
  ) {
    return await this.svcBranchService.finalizeBranch(branchId);
  }

  // ─── STANDARD OPERATIONS ────────────────────────────────────────────────

  @MessagePattern(BRANCH_TOPICS.GET_ALL)
  async getBranches(@Payload() restaurantId: string) {
    return await this.svcBranchService.getBranches(restaurantId);
  }

  @MessagePattern(BRANCH_TOPICS.GET_BY_ID)
  async getBranchById(
    @Payload()
    { restaurantId, branchId }: { restaurantId: string; branchId: string },
  ) {
    return await this.svcBranchService.getBranchById(restaurantId, branchId);
  }

  @MessagePattern(BRANCH_TOPICS.UPDATE)
  async updateBranch(
    @Payload()
    {
      restaurantId,
      branchId,
      data,
    }: {
      restaurantId: string;
      branchId: string;
      data: UpdateBranchDto;
    },
  ) {
    return await this.svcBranchService.updateBranch(
      restaurantId,
      branchId,
      data,
    );
  }

  @MessagePattern(BRANCH_TOPICS.DELETE)
  async deleteBranch(
    @Payload()
    { restaurantId, branchId }: { restaurantId: string; branchId: string },
  ) {
    return await this.svcBranchService.deleteBranch(restaurantId, branchId);
  }
}
