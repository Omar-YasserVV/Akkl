import { MembershipTier, ProfileStats } from "@/types/profile";

export function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const BORING_AVATAR_COLORS = [
  "#0057C0",
  "#60A5FA",
  "#D8ECFF",
  "#F8B84E",
  "#2D3748",
];

function hashSeed(seed: string) {
  return Array.from(seed || "akkl").reduce(
    (hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0,
    0,
  );
}

function colorAt(hash: number, offset: number) {
  return BORING_AVATAR_COLORS[(hash + offset) % BORING_AVATAR_COLORS.length];
}

export function buildBoringAvatarDataUri(seed: string, size = 128): string {
  const hash = hashSeed(seed.toLowerCase().trim());
  const bg = colorAt(hash, 0);
  const c1 = colorAt(hash >> 3, 1);
  const c2 = colorAt(hash >> 6, 2);
  const c3 = colorAt(hash >> 9, 3);
  const rotate = hash % 360;
  const offset = (hash % 18) - 9;
  const square = 30 + (hash % 20);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 128 128">
      <rect width="128" height="128" rx="64" fill="${bg}"/>
      <g transform="rotate(${rotate} 64 64)">
        <circle cx="${42 + offset}" cy="42" r="38" fill="${c1}" opacity="0.92"/>
        <rect x="${58 - offset}" y="18" width="${square}" height="${square}" rx="12" fill="${c2}" opacity="0.9"/>
        <circle cx="${86 - offset}" cy="88" r="34" fill="${c3}" opacity="0.86"/>
        <path d="M20 88 C42 56 70 112 108 50" fill="none" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" opacity="0.55"/>
      </g>
    </svg>
  `.replace(/\s+/g, " ").trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function resolveMembershipTier(totalPoints: number): MembershipTier {
  if (totalPoints >= 500) return "platinum";
  if (totalPoints >= 300) return "gold";
  if (totalPoints >= 150) return "silver";
  return "bronze";
}

export function buildProfileStats(
  totalOrders: number,
  totalSpent: number,
): ProfileStats {
  const totalPoints = Math.round(totalSpent / 10) + totalOrders * 5;
  const membershipTier = resolveMembershipTier(totalPoints);
  const tierThresholds: Record<MembershipTier, number> = {
    bronze: 150,
    silver: 300,
    gold: 500,
    platinum: 500,
  };

  return {
    totalPoints,
    totalOrders,
    totalSpent,
    membershipTier,
    nextTierPoints: tierThresholds[membershipTier],
  };
}

export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })} LE`;
}
