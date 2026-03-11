import { Controller, Get } from '@nestjs/common';
import { SvcBranchService } from './svc-branch.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateBranchDto, UpdateBranchDto } from '@app/common';

@Controller()
export class SvcBranchController {
  constructor(private readonly svcBranchService: SvcBranchService) {}

  @MessagePattern('create-branch')
  async createBranch(
    @Payload() data: { restaurantId: number; dto: CreateBranchDto },
  ) {
    return await this.svcBranchService.createBranch(
      data.restaurantId,
      data.dto,
    );
  }

  @MessagePattern('get-branches')
  async getBranches(@Payload() restaurantId: number) {
    return await this.svcBranchService.getBranches(restaurantId);
  }

  @MessagePattern('get-branch-by-id')
  async getBranchById(
    @Payload()
    { restaurantId, branchId }: { restaurantId: number; branchId: number },
  ) {
    return await this.svcBranchService.getBranchById(restaurantId, branchId);
  }

  @MessagePattern('update-branch')
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

  @MessagePattern('delete-branch')
  async deleteBranch(
    @Payload()
    { restaurantId, branchId }: { restaurantId: number; branchId: number },
  ) {
    return await this.svcBranchService.deleteBranch(restaurantId, branchId);
  }
}
