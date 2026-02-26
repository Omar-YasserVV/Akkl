import { div } from "framer-motion/client";

const OverviewHeader = () => {
  return (
    <div>
      <div className="space-y-2.5">
        <h2 className="font-cherry text-primary text-5xl">Overview</h2>
        <p className="text-muted-foreground">
          Manage orders from app and restaurant in real-time.
        </p>
      </div>
    </div>
  );
};

export default OverviewHeader;
