import { oc } from '@orpc/contract';
import { z } from 'zod';
import { RestaurantBaseSchema, RestaurantWithBranchesSchema } from './schemas';

export const restaurantContract = {
  createRestaurant: oc
    .route({ method: 'POST', path: '/restaurants' })
    .input(z.object({
      userId: z.number(), // Passed as ownerId in service
      name: z.string(),
      logoUrl: z.string().optional(),
    }))
    .output(RestaurantBaseSchema),

  getRestaurants: oc
    .route({ method: 'GET', path: '/restaurants' })
    .input(z.undefined())
    .output(z.array(RestaurantWithBranchesSchema)),

  getRestaurantsByOwner: oc
    .route({ method: 'GET', path: '/owners/{ownerId}/restaurants' })
    .input(z.object({ ownerId: z.number() }))
    .output(z.array(RestaurantBaseSchema)),

  getRestaurantById: oc
    .route({ method: 'GET', path: '/restaurants/{id}' })
    .input(z.object({ id: z.number() }))
    .output(RestaurantBaseSchema),

  updateRestaurant: oc
    .route({ method: 'PATCH', path: '/restaurants/{id}' })
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      logoUrl: z.string().optional(),
    }))
    .output(RestaurantBaseSchema),

  deleteRestaurant: oc
    .route({ method: 'DELETE', path: '/restaurants/{id}' })
    .input(z.object({ id: z.number() }))
    .output(RestaurantBaseSchema),
};