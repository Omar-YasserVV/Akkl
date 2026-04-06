import { useRouter } from "expo-router";
import { createContext, PropsWithChildren, useState } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const login = () => {
    setIsAuthenticated(true);
    router.replace("/(tabs)");
  };
  const logout = () => {
    setIsAuthenticated(false);
    router.replace("/(auth)/sign-in");
  };
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
