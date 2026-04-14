import { apiClient } from "../api";

export interface User {
  id: number;
  fullName: string;
  username: string;
  branchId: number;
  role: string;
  email: string;
  image: string;
}

export const authApis = {
  login: async (credentials: { email: string; password: string }) => {
    return apiClient.post<{ data: { user: User } }>("/auth/login", credentials);
  },
  me: async () => {
    return apiClient.get<User>("/auth/me");
  },
  logout: async () => {
    return apiClient.post<{ status: string }>("/auth/logout");
  },
};
