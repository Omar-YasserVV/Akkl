import { ReactNode } from "react";

type HeaderProps = {
  title: string;
  description: string;
  action?: ReactNode;
  before?: ReactNode;
  className?: string;
};

const Header = ({
  title,
  description,
  action,
  before,
  className = "",
}: HeaderProps) => {
  return (
    <header className={`flex justify-between items-end gap-6 ${className}`}>
      {/* 
      //TODO: Omar/ Refactor this to be more flexible and not rely on the before and action props. Maybe use a more generic approach with slots or something similar.
      */}
      <div className="flex gap-5 items-center justify-center">
        {before && <div className="mb-3">{before}</div>}

        <div className="space-y-2.5">
          <h2 className="font-cherry text-primary text-5xl leading-tight">
            {title}
          </h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>

      {action && <div className="pb-1">{action}</div>}
    </header>
  );
};

export default Header;
