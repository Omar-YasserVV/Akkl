import { z } from 'zod';

export const RestaurantBaseSchema = z.object({
  id: z.number(),
  name: z.string(),
  logoUrl: z.string().optional().nullable(),
  ownerId: z.number(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

// For GetRestaurants which includes branch data
export const RestaurantWithBranchesSchema = RestaurantBaseSchema.extend({
  branches: z.array(z.any()).optional(), 
});