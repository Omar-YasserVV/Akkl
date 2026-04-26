import { useEffect, useState } from "react";
import { formatTimeAgo } from "../utils/src/helpers/formatters/date-utils";

export const useTimeAgo = (timestamp: string | Date | number): string => {
  const [relativeTime, setRelativeTime] = useState<string>(() =>
    formatTimeAgo(timestamp),
  );

  useEffect(() => {
    const tick = () => setRelativeTime(formatTimeAgo(timestamp));

    // Initial update in case timestamp changed since last render
    tick();

    const intervalId = setInterval(tick, 60000); // 1 minute

    return () => clearInterval(intervalId);
  }, [timestamp]);

  return relativeTime;
};
