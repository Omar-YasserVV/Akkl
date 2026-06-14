import { AppLanguage, AppSettings } from "@/types/settings";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SettingsState extends AppSettings {
  setLanguage: (language: AppLanguage) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setBiometricLoginEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: "en",
      notificationsEnabled: true,
      biometricLoginEnabled: false,
      setLanguage: (language) => set({ language }),
      setNotificationsEnabled: (notificationsEnabled) =>
        set({ notificationsEnabled }),
      setBiometricLoginEnabled: (biometricLoginEnabled) =>
        set({ biometricLoginEnabled }),
    }),
    {
      name: "akkl-settings",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
