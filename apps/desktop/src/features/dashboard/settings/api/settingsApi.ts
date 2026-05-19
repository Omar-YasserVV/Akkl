import type { SettingsOnboardingData } from "../types/settings.types";

export const saveSettingsOnboarding = async (
  data: SettingsOnboardingData,
): Promise<SettingsOnboardingData> => {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 250);
  });

  return data;
};
