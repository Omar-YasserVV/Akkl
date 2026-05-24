import { useSettingsOnboarding } from "../hooks/useSettingsOnboarding";
import BranchIdentityStep from "./branch-identity/BranchIdentityStep";
import FloorPlanStep from "./floor-plan/FloorPlanStep";
import HardwareConnectingStep from "./hardware-connecting/HardwareConnectingStep";
import OperatingHoursStep from "./operating-hours/OperatingHoursStep";
import SettingsFooter from "./SettingsFooter";

const SettingsOnboarding = () => {
  const {
    activeStepId,
    currentStep,
    progress,
    isFirstStep,
    isLastStep,
    isSaving,
    goBack,
    goNext,
    saveDraft,
  } = useSettingsOnboarding();

  return (
    <section className="mx-auto flex min-h-full flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8 space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">
              {currentStep.eyebrow}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              {currentStep.title}
            </h1>
          </div>
          {isLastStep ? (
            <p className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              Final Step
            </p>
          ) : (
            <p className="text-sm font-semibold text-slate-500">
              {progress}% Complete
            </p>
          )}
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="max-w-3xl text-[15px] leading-relaxed text-slate-500">
          {currentStep.description}
        </p>
      </div>

      <div className="my-8 flex-1">
        {activeStepId === "branch-identity" && <BranchIdentityStep />}
        {activeStepId === "operating-hours" && <OperatingHoursStep />}
        {activeStepId === "floor-plan" && <FloorPlanStep />}
        {activeStepId === "hardware-connecting" && <HardwareConnectingStep />}
      </div>

      <SettingsFooter
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        isSaving={isSaving}
        onBack={goBack}
        onNext={goNext}
        onSaveDraft={saveDraft}
      />
    </section>
  );
};

export default SettingsOnboarding;
