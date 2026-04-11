import { z } from 'zod';

export const UserRoleEnum = z.enum([
  'CUSTOMER',
  'BUSINESS_OWNER',
  'CHIEF',
  'WAITER',
  'MANAGER',
  'CASHIER',
]);

export const UserResponseSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  fullName: z.string(),
  username: z.string(),
  role: UserRoleEnum,
  image: z.string().optional().nullable(),
  branchId: z.number().optional().nullable(),
  branchName: z.string().optional().nullable(),
  restaurantName: z.string().optional().nullable(),
});

export const AuthResultSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  user: UserResponseSchema,
});

export const CreateEmployeeResponseSchema = z.object({
  message: z.string(),
  id: z.number(),
  generatedUsername: z.string(),
  tempPassword: z.string(),
});