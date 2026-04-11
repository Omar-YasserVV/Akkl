import { oc } from '@orpc/contract';
import { z } from 'zod';

const MenuItemVariationSchema = z.object({
  size: z.string(),
  price: z.number(),
  discountPrice: z.number().optional().nullable(),
});

const MenuItemResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  isAvailable: z.boolean(),
  variations: z.array(MenuItemVariationSchema),
  dietaryTags: z.array(z.any()).optional(),
  recipe: z.array(z.any()).optional(),
});

export const menuContract = {
  getBranchMenu: oc
    .route({ method: 'GET', path: '/branches/{branchId}/menu' })
    .input(z.object({ branchId: z.number() }))
    .output(z.array(MenuItemResponseSchema)),

  createMenuItem: oc
    .route({ method: 'POST', path: '/branches/{branchId}/menu' })
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
      image: z.string().optional(),
      isAvailable: z.boolean().default(true),
      menuItemId: z.number(),
      variations: z.array(MenuItemVariationSchema).optional(),
      dietaryTags: z.array(z.number()).optional(),
    }))
    .output(MenuItemResponseSchema),

  updateMenuItem: oc
    .route({ method: 'PATCH', path: '/branches/{branchId}/menu/{menuItemId}' })
    .input(z.object({
      branchId: z.number(),
      menuItemId: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      isAvailable: z.boolean().optional(),
      variations: z.array(MenuItemVariationSchema).optional(),
    }))
    .output(MenuItemResponseSchema),

  deleteMenuItem: oc
    .route({ method: 'DELETE', path: '/branches/{branchId}/menu/{menuItemId}' })
    .input(z.object({ branchId: z.number(), menuItemId: z.number() }))
    .output(z.object({ message: z.string() })),
};