import { Spinner } from "@heroui/react";
import { useEffect } from "react";
import SettingsOnboarding from "./components/SettingsOnboarding";
import SettingsSummaryPage from "./components/SettingsSummaryPage";
import { useBranchDetails } from "./hooks/useSettings";
import { useSettingsStore } from "./store/useSettingsStore";

const Settings = () => {
  const isOnboardingComplete = useSettingsStore(
    (state) => state.isOnboardingComplete,
  );
  const hydrateFromBranchDetails = useSettingsStore(
    (state) => state.hydrateFromBranchDetails,
  );
  const { data: branchDetails, isLoading, isError } = useBranchDetails();

  useEffect(() => {
    if (branchDetails) {
      hydrateFromBranchDetails(branchDetails);
    }
  }, [branchDetails, hydrateFromBranchDetails]);

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Spinner color="primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-danger-100 bg-danger-50 p-6 text-danger">
        Could not load branch settings. Please try again.
      </div>
    );
  }

  return isOnboardingComplete ? <SettingsSummaryPage /> : <SettingsOnboarding />;
};

export default Settings;
