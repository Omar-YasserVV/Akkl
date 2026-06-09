import { authApis, User } from "@repo/utils";
import { useRouter, useSegments } from "expo-router";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  // Default to true so the app knows it is verifying state on startup
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    handleAuthCheck();
  }, []);

  // Handle native protection routing rules when auth state or route segments change
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect unauthenticated users to sign-in
      router.replace("/(auth)/sign-in");
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect authenticated users away from login pages
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, segments, isLoading]);

  const handleAuthCheck = async () => {
    try {
      const response = await authApis.me();
      // Ensure we treat falsy responses (like empty objects/null) as unauthenticated
      if (response) {
        setUser(response);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (credentials: any) => {
    try {
      setIsLoading(true);
      const response = await authApis.login(credentials);

      // Safe access checking based on your generic response structure
      const userData = response?.data?.user || response;
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Propagate up so your UI form can display the specific error
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await authApis.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
    {
      // Always clear local state on logout attempt to prevent getting stuck
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
