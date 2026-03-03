import { ReactNode } from "react";

type HeaderProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

const Header = ({ title, description, action }: HeaderProps) => {
  return (
    <header className="flex justify-between items-end gap-6">
      <div className="space-y-2.5">
        <h2 className="font-cherry text-primary text-5xl">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {action && <div>{action}</div>}
    </header>
  );
};

export default Header;
