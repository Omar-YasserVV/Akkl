import { apiClient } from "@repo/utils";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Represents a User object.
 * @property {number} id - Unique identifier for the user.
 * @property {string} username - User's username.
 * @property {string} fullName - User's full name.
 * @property {number} branchId - Branch ID the user belongs to.
 * @property {string} role - User's role.
 * @property {string} email - User's email address.
 * @property {string} image - URL or path to user's image.
 * @example
 * ```json
 * {
 *   "data": {
 *     "id": 1,
 *     "username": "johndoe",
 *     "fullName": "John Doe",
 *     "branchId": 3,
 *     "role": "employee",
 *     "email": "johndoe@example.com",
 *     "image": "https://example.com/avatar.png"
 *   }
 * }
 * ```
 */
export interface User {
  id: number;
  username: string;
  fullName: string;
  branchId: number;
  role: string;
  email: string;
  image: string;
}

/**
 * Zustand AuthStore state and API, persisted in local storage.
 * @property {User["data"] | null} user - Authenticated user data or null if unauthenticated
 * @property {boolean} isAuthenticated - Is the current session authenticated
 * @property {boolean} isLoading - Is an async auth operation in progress
 * @property {() => Promise<void>} authCheck - Checks if user session is valid
 * @property {(data: { email: string; password: string }) => Promise<void>} login - Perform login and set auth state
 * @property {() => void} logout - Reset user and authentication state
 * @example
 * ```json
 * {
 *   "user": {
 *     "id": 2,
 *     "username": "staff01",
 *     "fullName": "Staff Person",
 *     "branchId": 7,
 *     "role": "employee",
 *     "email": "staff@example.com",
 *     "image": "/img/staff01.png"
 *   },
 *   "isAuthenticated": true,
 *   "isLoading": false
 * }
 * ```
 */
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authCheck: () => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

/**
 * Zustand store for authentication, persists user and authentication state in local storage.
 *
 * Login and profile APIs expect/return objects in the following format:
 * @example
 * ```json
 * // /auth/employee/login or /auth/employee/me response
 * {
 *   "status": "success",
 *   "data": {
 *     "id": 5,
 *     "username": "janedoe",
 *     "fullName": "Jane Doe",
 *     "branchId": 10,
 *     "role": "employee",
 *     "email": "janedoe@example.com",
 *     "image": "/media/jane.png"
 *   }
 * }
 * ```
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      authCheck: async () => {
        set({ isLoading: true });
        try {
          const res = await apiClient.get<{ status: string; data: User }>(
            "/auth/employee/me",
          );
          set({ user: res.data, isAuthenticated: true, isLoading: false });
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const res = await apiClient.post<{ status: string; data: User }>(
            "/auth/employee/login",
            credentials,
          );
          set({ user: res.data, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      logout: () =>
        set({ user: null, isAuthenticated: false, isLoading: false }),
    }),
    { name: "auth-storage" },
  ),
);
