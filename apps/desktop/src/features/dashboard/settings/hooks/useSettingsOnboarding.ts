import { useMemo, useState } from "react";
import { saveSettingsOnboarding } from "../api/settingsApi";
import { settingsSteps } from "../static/settingsDefaults";
import { useSettingsStore } from "../store/useSettingsStore";

export const useSettingsOnboarding = () => {
  const activeStepId = useSettingsStore((state) => state.activeStepId);
  const setActiveStepId = useSettingsStore((state) => state.setActiveStepId);
  const completeOnboarding = useSettingsStore((state) => state.completeOnboarding);
  const data = useSettingsStore((state) => state.data);
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

  const goNext = async () => {
    if (!isLastStep) {
      const nextStep = settingsSteps[activeStepIndex + 1];
      if (nextStep) {
        setActiveStepId(nextStep.id);
      }
      return;
    }

    setIsSaving(true);
    try {
      await saveSettingsOnboarding(data);
      completeOnboarding();
    } finally {
      setIsSaving(false);
    }
  };

  const saveDraft = async () => {
    setIsSaving(true);
    try {
      await saveSettingsOnboarding(data);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    activeStepId,
    currentStep,
    progress,
    isFirstStep,
    isLastStep,
    isSaving,
    goBack,
    goNext,
    saveDraft,
  };
};
