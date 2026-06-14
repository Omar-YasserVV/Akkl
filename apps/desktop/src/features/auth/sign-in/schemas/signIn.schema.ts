import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Email must be a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export type SignInFormData = z.infer<typeof signInSchema>;
