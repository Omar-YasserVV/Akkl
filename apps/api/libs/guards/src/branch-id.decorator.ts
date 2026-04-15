import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  branchId?: string | number;
  user?: {
    sub: number;
    role: string;
  };
}

export interface BranchContext {
  restaurantId: number;
  branchId: number;
}

export const GetBranchContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): BranchContext => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

    const restaurantId = request.params.restaurantId;

    const branchId =
      request.params.branchId || request.branchId || request.params.id;

    const rId = Number(restaurantId);
    const bId = Number(branchId);

    if (!restaurantId || isNaN(rId)) {
      throw new BadRequestException('Invalid Restaurant ID');
    }
    if (!branchId || isNaN(bId)) {
      throw new BadRequestException('Invalid Branch ID');
    }

    return { restaurantId: rId, branchId: bId };
  },
);
