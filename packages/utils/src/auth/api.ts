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
    try {
      const res = await apiClient.post<{ status: string; data: User }>(
        "/auth/employee/login",
        credentials,
      );
      return res;
    } catch (error) {
      throw error;
    }
  },
  me: async () => {
    try {
      const res = await apiClient.get<{ status: string; data: User }>(
        "/auth/employee/me",
      );
      return res;
    } catch (error) {
      throw error;
    }
  },
  logout: async () => {
    try {
      const res = await apiClient.post<{ status: string }>("/auth/logout");
      return res;
    } catch (error) {
      throw error;
    }
  },
};
