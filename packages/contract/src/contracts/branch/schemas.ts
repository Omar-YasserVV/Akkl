import { z } from 'zod';

export const BranchResponseSchema = z.object({
  id: z.number(),
  branchNumber: z.string(),
  name: z.string(),
  address: z.string(),
  restaurantId: z.number(),
  haveTables: z.boolean(),
  haveReservations: z.boolean(),
  haveWarehouses: z.boolean(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
  warehouses: z.array(z.any()).optional(),
  tables: z.array(z.any()).optional(),
});