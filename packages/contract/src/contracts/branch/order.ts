import { oc } from '@orpc/contract';
import { z } from 'zod';

export const orderContract = {
  createOrder: oc
    .route({ method: 'POST', path: '/branches/{branchId}/orders' })
    .input(z.object({
      branchId: z.number(),
      userId: z.number(),
      totalAmount: z.number(),
      status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).default('PENDING'),
    }))
    .output(z.any()),

  getOrdersByBranch: oc
    .route({ method: 'GET', path: '/branches/{branchId}/orders' })
    .input(z.object({ branchId: z.number() }))
    .output(z.array(z.any())),

  updateOrder: oc
    .route({ method: 'PATCH', path: '/orders/{orderId}' })
    .input(z.object({
      orderId: z.number(),
      status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
    }))
    .output(z.any()),
};