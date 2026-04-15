import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

export interface BranchContext {
  restaurantId: number;
  branchId: number;
}

export const GetBranchContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): BranchContext => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const { restaurantId, branchId } = request.params;

    const rId = Number(restaurantId);
    const bId = Number(branchId);

    if (isNaN(rId) || isNaN(bId)) {
      throw new BadRequestException('Invalid Restaurant or Branch ID');
    }

    return { restaurantId: rId, branchId: bId };
  },
);
