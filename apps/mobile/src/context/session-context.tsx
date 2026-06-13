import AsyncStorage from "@react-native-async-storage/async-storage";
import { setBranchIdGetter } from "@repo/utils";
import { useRouter, useSegments } from "expo-router";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useCartStore } from "@/stores/cart-store";
import { useAuth } from "./auth-context";

const RESTAURANT_KEY = "akkl:session:restaurant";
const BRANCH_KEY = "akkl:session:branch";

export interface SessionRestaurant {
  id: string;
  name: string;
  logoUrl: string | null;
}

export interface SessionBranch {
  id: string;
  name: string;
}

interface SessionContextType {
  restaurant: SessionRestaurant | null;
  branch: SessionBranch | null;
  isLoading: boolean;
  setRestaurant: (restaurant: SessionRestaurant) => Promise<void>;
  setBranch: (branch: SessionBranch) => Promise<void>;
  clearSession: () => Promise<void>;
}

export const SessionContext = createContext<SessionContextType | undefined>(
  undefined,
);

function syncBranchIdGetter(next: SessionBranch | null) {
  setBranchIdGetter(() => next?.id ?? null);
}

export function SessionProvider({ children }: PropsWithChildren) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  const [restaurant, setRestaurantState] = useState<SessionRestaurant | null>(
    null,
  );
  const [branch, setBranchState] = useState<SessionBranch | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.multiGet([RESTAURANT_KEY, BRANCH_KEY])
      .then(([[, storedRestaurant], [, storedBranch]]) => {
        if (storedRestaurant) {
          setRestaurantState(JSON.parse(storedRestaurant));
        }
        if (storedBranch) {
          const parsedBranch = JSON.parse(storedBranch) as SessionBranch;
          setBranchState(parsedBranch);
          syncBranchIdGetter(parsedBranch);
        }
      })
      .catch((error) => {
        console.error("Failed to load session", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (authLoading || isLoading || !isAuthenticated) return;

    const segment = segments[0];
    const inAuth = segment === "(auth)";
    const onRestaurantPick = segment === "select-restaurant";
    const onBranchPick = segment === "select-branch";

    if (!restaurant) {
      if (!onRestaurantPick && !inAuth) {
        router.replace("/select-restaurant");
      }
      return;
    }

    if (!branch) {
      if (!onBranchPick && !onRestaurantPick && !inAuth) {
        router.replace("/select-branch");
      }
      return;
    }

    if (inAuth) {
      router.replace("/(tabs)");
    }
  }, [
    authLoading,
    isLoading,
    isAuthenticated,
    restaurant,
    branch,
    segments,
    router,
  ]);

  const setRestaurant = useCallback(async (next: SessionRestaurant) => {
    setRestaurantState(next);
    setBranchState(null);
    syncBranchIdGetter(null);
    await AsyncStorage.setItem(RESTAURANT_KEY, JSON.stringify(next));
    await AsyncStorage.removeItem(BRANCH_KEY);
  }, []);

  const setBranch = useCallback(
    async (next: SessionBranch) => {
      setBranchState(next);
      syncBranchIdGetter(next);
      await AsyncStorage.setItem(BRANCH_KEY, JSON.stringify(next));

      if (restaurant) {
        useCartStore.getState().setBranchContext({
          branchId: next.id,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          branchName: next.name,
        });
      }
    },
    [restaurant],
  );

  const clearSession = useCallback(async () => {
    setRestaurantState(null);
    setBranchState(null);
    syncBranchIdGetter(null);
    await AsyncStorage.multiRemove([RESTAURANT_KEY, BRANCH_KEY]);
  }, []);

  return (
    <SessionContext.Provider
      value={{
        restaurant,
        branch,
        isLoading,
        setRestaurant,
        setBranch,
        clearSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
}
