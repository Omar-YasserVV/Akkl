type SettingsProgressProps = {
  progress: number;
  stepLabel: string;
};

const SettingsProgress = ({ progress, stepLabel }: SettingsProgressProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Onboarding
        </p>
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-500">{stepLabel}</p>
          <p className="text-xl font-bold text-primary">{progress}% Complete</p>
        </div>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-primary/10">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default SettingsProgress;
