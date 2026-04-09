import { apiClient } from "../api";

export interface User {
  id: number;
  username: string;
  fullName: string;
  branchId: number;
  role: string;
  email: string;
  image: string;
}

export const authApis = {
  login: async (credentials: { email: string; password: string }) => {
    return apiClient.post<{ status: string; data: User }>(
      "/auth/login",
      credentials,
    );
  },
  me: async () => {
    return apiClient.get<{ status: string; data: User }>("/auth/me");
  },
  logout: async () => {
    return apiClient.post<{ status: string }>("/auth/logout");
  },
};
