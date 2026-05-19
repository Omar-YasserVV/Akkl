import type { ReactNode } from "react";

type SectionCardProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  right?: ReactNode;
};

const SectionCard = ({ title, description, children, right }: SectionCardProps) => {
  const hasHeader = title || description || right;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {hasHeader && (
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            {title && (
              <h2 className="text-lg font-bold text-slate-950">{title}</h2>
            )}
            {description && (
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {description}
              </p>
            )}
          </div>
          {right}
        </div>
      )}
      <div className="p-6">{children}</div>
    </article>
  );
};

export default SectionCard;
