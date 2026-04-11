import { oc } from '@orpc/contract';
import { z } from 'zod';
import { BranchResponseSchema } from './schemas';

export const branchContract = {
  createBranch: oc
    .route({ method: 'POST', path: '/restaurants/{restaurantId}/branches' })
    .input(z.object({
      restaurantId: z.number(),
      name: z.string(),
      address: z.string(),
      branchNumber: z.union([z.string(), z.number()]),
      haveTables: z.boolean().default(false),
      tablesCount: z.number().optional(),
      haveWarehouses: z.boolean().default(false),
      warehouseName: z.string().optional(),
    }))
    .output(BranchResponseSchema),

  getBranches: oc
    .route({ method: 'GET', path: '/restaurants/{restaurantId}/branches' })
    .input(z.object({ restaurantId: z.number() }))
    .output(z.array(BranchResponseSchema)),

  getBranchById: oc
    .route({ method: 'GET', path: '/restaurants/{restaurantId}/branches/{branchId}' })
    .input(z.object({ restaurantId: z.number(), branchId: z.number() }))
    .output(z.any()), // Full include tree from service

  updateBranch: oc
    .route({ method: 'PATCH', path: '/restaurants/{restaurantId}/branches/{branchId}' })
    .input(z.object({
      restaurantId: z.number(),
      branchId: z.number(),
      name: z.string().optional(),
      address: z.string().optional(),
    }))
    .output(BranchResponseSchema),

  deleteBranch: oc
    .route({ method: 'DELETE', path: '/restaurants/{restaurantId}/branches/{branchId}' })
    .input(z.object({ restaurantId: z.number(), branchId: z.number() }))
    .output(z.object({ deleted: z.boolean() })),
};
