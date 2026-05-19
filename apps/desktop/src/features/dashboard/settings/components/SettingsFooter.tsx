import { Button } from "@heroui/react";
import { LuArrowLeft, LuArrowRight, LuCircleCheck } from "react-icons/lu";

type SettingsFooterProps = {
  isFirstStep: boolean;
  isLastStep: boolean;
  isSaving: boolean;
  onBack: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
};

const SettingsFooter = ({
  isFirstStep,
  isLastStep,
  isSaving,
  onBack,
  onNext,
  onSaveDraft,
}: SettingsFooterProps) => {
  return (
    <footer className="flex items-center justify-between border-t border-slate-200 pt-7">
      <Button
        variant="light"
        isDisabled={isFirstStep || isSaving}
        className="font-bold text-slate-600"
        onPress={onBack}
      >
        <LuArrowLeft className="h-5 w-5" />
        Back
      </Button>

      {isLastStep ? (
        <div className="flex items-center gap-6">
          <div className="text-right leading-none">
            <p className="mb-1 text-xs font-bold tracking-wide text-[#10B981]">
              READY TO GO
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              3 Hardware Linked
            </p>
          </div>
          <Button
            color="primary"
            isLoading={isSaving}
            className="min-w-48 font-bold text-white shadow-lg shadow-primary/20"
            onPress={onNext}
          >
            Complete Setup
            <LuCircleCheck className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Button
            variant="light"
            isLoading={isSaving}
            className="font-bold text-slate-500"
            onPress={onSaveDraft}
          >
            Save Draft
          </Button>
          <Button
            color="primary"
            isLoading={isSaving}
            className="min-w-52 font-bold text-white shadow-lg shadow-primary/20"
            onPress={onNext}
          >
            Continue to Step
            <LuArrowRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </footer>
  );
};

export default SettingsFooter;
