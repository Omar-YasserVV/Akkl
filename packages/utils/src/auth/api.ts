import { apiClient } from "../api";

export interface User {
  id: string;
  fullName: string;
  username: string;
  branchId?: string | null;
  role: string;
  email: string;
  phone?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  birthDate?: string;
  image?: string | null;
}

export interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
  image?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  birthDate?: string;
}

export interface SignupPayload {
  email: string;
  password: string;
  fullName: string;
  username: string;
  phone: string;
  role?: "CUSTOMER" | "BUSINESS_OWNER" | "CHIEF" | "WAITER" | "MANAGER" | "CASHIER";
}

export const authApis = {
  login: async (credentials: { email: string; password: string }) => {
    return apiClient.post<{ data: { user: User } }>("/auth/login", credentials);
  },
  signup: async (payload: SignupPayload) => {
    return apiClient.post<{ data: { user: User } }>("/auth/signup", payload);
  },
  me: async () => {
    return apiClient.get<User>("/auth/me");
  },
  updateProfile: async (payload: UpdateProfilePayload) => {
    return apiClient.patch<User>("/auth/me", payload);
  },
  logout: async () => {
    return apiClient.post<{ status: string }>("/auth/logout");
  },
  forgotPassword: async (email: string) => {
    return apiClient.post<{ message: string }>("/auth/forgot-password", {
      email,
    });
  },
  resetPassword: async (payload: {
    email: string;
    otp: string;
    newPassword: string;
  }) => {
    return apiClient.post<{ message: string }>("/auth/reset-password", payload);
  },
};
