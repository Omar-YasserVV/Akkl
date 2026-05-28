import { useMemo, useState } from "react";
import {
  useFinalizeBranch,
  useOnboardBranch,
} from "./useSettings";
import { settingsSteps } from "../static/settingsDefaults";
import { useSettingsStore } from "../store/useSettingsStore";
import { mapSettingsDataToBranchPayload } from "../utils/settingsMappers";

export const useSettingsOnboarding = () => {
  const activeStepId = useSettingsStore((state) => state.activeStepId);
  const setActiveStepId = useSettingsStore((state) => state.setActiveStepId);
  const completeOnboarding = useSettingsStore((state) => state.completeOnboarding);
  const hydrateFromBranchDetails = useSettingsStore(
    (state) => state.hydrateFromBranchDetails,
  );
  const isEditingExistingBranch = useSettingsStore(
    (state) => state.isEditingExistingBranch,
  );
  const data = useSettingsStore((state) => state.data);
  const onboardBranch = useOnboardBranch();
  const finalizeBranch = useFinalizeBranch();
  const [isSaving, setIsSaving] = useState(false);

  const activeStepIndex = settingsSteps.findIndex(
    (step) => step.id === activeStepId,
  );

  const currentStep = settingsSteps[activeStepIndex] ?? settingsSteps[0]!;
  const isFirstStep = activeStepIndex === 0;
  const isLastStep = activeStepIndex === settingsSteps.length - 1;

  const progress = useMemo(
    () => Math.round(((activeStepIndex + 1) / settingsSteps.length) * 100),
    [activeStepIndex],
  );

  const goBack = () => {
    const previousStep = settingsSteps[activeStepIndex - 1];
    if (previousStep) {
      setActiveStepId(previousStep.id);
    }
  };

  const saveSettings = async (shouldComplete: boolean) => {
    setIsSaving(true);
    try {
      const payload = mapSettingsDataToBranchPayload(data);
      const savedBranchDetails = await onboardBranch.mutateAsync(payload);
      const branchDetails =
        shouldComplete && !isEditingExistingBranch
          ? await finalizeBranch.mutateAsync()
          : savedBranchDetails;

      hydrateFromBranchDetails(branchDetails);
      if (shouldComplete) {
        completeOnboarding();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const goNext = async () => {
    if (!isLastStep) {
      const nextStep = settingsSteps[activeStepIndex + 1];
      if (nextStep) {
        setActiveStepId(nextStep.id);
      }
      return;
    }

    await saveSettings(true);
  };

  const saveDraft = async () => {
    await saveSettings(false);
  };

  return {
    activeStepId,
    currentStep,
    progress,
    isFirstStep,
    isLastStep,
    isSaving:
      isSaving ||
      onboardBranch.isPending ||
      finalizeBranch.isPending,
    goBack,
    goNext,
    saveDraft,
  };
};
