import { oc } from '@orpc/contract';
import { z } from 'zod';
import {
    AuthResultSchema,
    CreateEmployeeResponseSchema,
    UserResponseSchema
} from './schemas';

export const authContract = {
  login: oc
    .route({ method: 'POST', path: '/auth/login' })
    .input(z.object({ 
      email: z.string().email(), 
      password: z.string() 
    }))
    .output(AuthResultSchema),

  signup: oc
    .route({ method: 'POST', path: '/auth/signup' })
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
      fullName: z.string(),
      phone: z.string(),
      username: z.string(),
    }))
    .output(AuthResultSchema),

  finalizeGoogleSignup: oc
    .route({ method: 'POST', path: '/auth/google/finalize' })
    .input(z.object({
      token: z.string(),
      password: z.string(),
      passwordConfirmation: z.string(),
      phone: z.string(),
      username: z.string(),
    }))
    .output(AuthResultSchema),

  forgotPassword: oc
    .route({ method: 'POST', path: '/auth/forgot-password' })
    .input(z.object({ email: z.string().email() }))
    .output(z.object({ message: z.string() })),

  verifyOtpAndReset: oc
    .route({ method: 'POST', path: '/auth/reset-password' })
    .input(z.object({
      email: z.string().email(),
      otp: z.string(),
      newPassword: z.string(),
    }))
    .output(z.object({ message: z.string() })),

  createEmployee: oc
    .route({ method: 'POST', path: '/auth/employee/create' })
    .input(z.object({
      email: z.string().email(),
      fullName: z.string(),
      phone: z.string(),
      role: z.string(), 
      branchId: z.number(),
      image: z.string().optional(),
    }))
    .output(CreateEmployeeResponseSchema),

  getProfile: oc
    .route({ method: 'GET', path: '/auth/profile/{id}' })
    .input(z.object({ id: z.number() }))
    .output(UserResponseSchema),
};