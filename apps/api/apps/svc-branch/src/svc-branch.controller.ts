import { Controller, Get } from '@nestjs/common';
import { SvcBranchService } from './svc-branch.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class SvcBranchController {
  constructor(private readonly svcBranchService: SvcBranchService) {}

  @MessagePattern('create-branch')
  async createBranch(@Payload() data: any) {
    const { restaurantId, ...branchData } = data;
    return await this.svcBranchService.createBranch(restaurantId, branchData);
  }
}
