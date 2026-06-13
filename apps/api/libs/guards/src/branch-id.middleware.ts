import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

interface BranchRequest extends Request {
  branchId?: string;
}

@Injectable()
export class BranchIdMiddleware implements NestMiddleware {
  use(req: BranchRequest, _res: Response, next: NextFunction) {
    const headerBranchId = req.headers['x-branch-id'];

    if (typeof headerBranchId === 'string' && headerBranchId.trim()) {
      req.branchId = headerBranchId.trim();
    }

    next();
  }
}
