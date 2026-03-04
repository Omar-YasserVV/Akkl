import { ReactNode } from "react";

type HeaderProps = {
  title: string;
  description: string;
  right?: ReactNode;
  left?: ReactNode;
  leftClassName?: string;
  rightClassName?: string;
};

const Header = ({
  title,
  description,
  left,
  right,
  leftClassName = "",
  rightClassName = "",
}: HeaderProps) => {
  return (
    <header className={`flex justify-between items-end gap-6`}>
      {/* 
        //TODO: Omar&Eyad/ Refactor this to be more flexible and not rely on the before and action props. Maybe use a more generic approach with slots or something similar.
      */}
      <div className="flex gap-4 items-center justify-center">
        {left && <div className={leftClassName}>{left}</div>}

        <div className="space-y-2.5">
          <h2 className="font-cherry text-primary text-5xl leading-tight">
            {title}
          </h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>

      {right && <div className={`pb-1 ${rightClassName}`}>{right}</div>}
    </header>
  );
};

export default Header;
