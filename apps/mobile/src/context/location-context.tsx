import * as Location from "expo-location";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

interface LocationContextType {
  lat: number | null;
  lng: number | null;
  isLoading: boolean;
  refreshLocation: () => Promise<void>;
}

const DEFAULT_LAT = 30.3082;
const DEFAULT_LNG = 31.7428;

export const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
);

export function LocationProvider({ children }: PropsWithChildren) {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLat(DEFAULT_LAT);
        setLng(DEFAULT_LNG);
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLat(position.coords.latitude);
      setLng(position.coords.longitude);
    } catch {
      setLat(DEFAULT_LAT);
      setLng(DEFAULT_LNG);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{ lat, lng, isLoading, refreshLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within LocationProvider");
  }
  return context;
}
