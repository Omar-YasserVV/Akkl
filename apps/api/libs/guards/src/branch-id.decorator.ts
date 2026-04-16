import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
interface CustomRequest extends Request {
  branchId?: number | string;
}
export const GetBranchId = createParamDecorator((ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<CustomRequest>();
  const branchId = request.params.branchId || request.branchId;

  if (!branchId) {
    throw new BadRequestException('Branch ID is required');
  }

  return String(branchId);
});
