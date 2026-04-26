type Unit = "year" | "month" | "day" | "hour" | "minute" | "second";

interface Interval {
  label: Unit;
  seconds: number;
}

const INTERVALS: Interval[] = [
  { label: "year", seconds: 31536000 },
  { label: "month", seconds: 2592000 },
  { label: "day", seconds: 86400 },
  { label: "hour", seconds: 3600 },
  { label: "minute", seconds: 60 },
  { label: "second", seconds: 1 },
];

export const formatTimeAgo = (dateInput: string | Date | number): string => {
  if (!dateInput) return "";

  const past = new Date(dateInput).getTime();
  const diffInSeconds = Math.floor((Date.now() - past) / 1000);

  // Handle future dates or very recent ones
  if (diffInSeconds < 30) return "just now";

  for (const interval of INTERVALS) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};
