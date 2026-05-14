import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

interface CustomRequest extends Request {
  branchId?: string;
  user?: {
    branchId?: string | null;
    [key: string]: unknown;
  };
}

export const GetBranchId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<CustomRequest>();

    const branchId = request.user?.branchId ?? request.branchId;

    if (!branchId) {
      throw new BadRequestException('Branch ID is required');
    }

    return String(branchId);
  },
);
