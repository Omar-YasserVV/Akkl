import SettingsOnboarding from "./components/SettingsOnboarding";
import SettingsSummaryPage from "./components/SettingsSummaryPage";
import { useSettingsStore } from "./store/useSettingsStore";

const Settings = () => {
  const isOnboardingComplete = useSettingsStore(
    (state) => state.isOnboardingComplete,
  );

  return isOnboardingComplete ? <SettingsSummaryPage /> : <SettingsOnboarding />;
};

export default Settings;
