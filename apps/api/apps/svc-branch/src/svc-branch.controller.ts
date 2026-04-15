import { CreateBranchDto, UpdateBranchDto } from '@app/common';
import { BRANCH_TOPICS } from '@app/common/topics/branch.topics';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SvcBranchService } from './svc-branch.service';

@Controller()
export class SvcBranchController {
  constructor(private readonly svcBranchService: SvcBranchService) {}

  @MessagePattern(BRANCH_TOPICS.CREATE)
  async createBranch(
    @Payload() data: { restaurantId: number; dto: CreateBranchDto },
  ) {
    return await this.svcBranchService.createBranch(
      data.restaurantId,
      data.dto,
    );
  }

  @MessagePattern(BRANCH_TOPICS.GET_ALL)
  async getBranches(@Payload() restaurantId: number) {
    return await this.svcBranchService.getBranches(restaurantId);
  }

  @MessagePattern(BRANCH_TOPICS.GET_BY_ID)
  async getBranchById(
    @Payload()
    { restaurantId, branchId }: { restaurantId: number; branchId: number },
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
      restaurantId: number;
      branchId: number;
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
    { restaurantId, branchId }: { restaurantId: number; branchId: number },
  ) {
    return await this.svcBranchService.deleteBranch(restaurantId, branchId);
  }
}
