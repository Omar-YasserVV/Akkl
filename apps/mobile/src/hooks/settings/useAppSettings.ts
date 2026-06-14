import { useSettingsStore } from "@/stores/settings-store";
import { AppLanguage } from "@/types/settings";

export function useAppSettings() {
  const language = useSettingsStore((state) => state.language);
  const notificationsEnabled = useSettingsStore(
    (state) => state.notificationsEnabled,
  );
  const biometricLoginEnabled = useSettingsStore(
    (state) => state.biometricLoginEnabled,
  );
  const setLanguage = useSettingsStore((state) => state.setLanguage);
  const setNotificationsEnabled = useSettingsStore(
    (state) => state.setNotificationsEnabled,
  );
  const setBiometricLoginEnabled = useSettingsStore(
    (state) => state.setBiometricLoginEnabled,
  );

  return {
    language,
    notificationsEnabled,
    biometricLoginEnabled,
    setLanguage: (value: AppLanguage) => setLanguage(value),
    toggleNotifications: () => setNotificationsEnabled(!notificationsEnabled),
    toggleBiometricLogin: () =>
      setBiometricLoginEnabled(!biometricLoginEnabled),
  };
}
