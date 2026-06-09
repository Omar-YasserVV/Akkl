export type OpenStatus = 'OPEN' | 'CLOSING_SOON' | 'CLOSED';

const DAY_KEYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  APPETIZER: 'Appetizers',
  MAIN_COURSE: 'Burgers & Mains',
  DESSERT: 'Desserts',
  BEVERAGE: 'Beverages',
  SIDE_DISH: 'Sides',
  OTHER: 'Other',
};

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function parseTimeToMinutes(value: string): number | null {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]!.toUpperCase();
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

export function getBranchOpenStatus(weeklyHours: unknown): {
  status: OpenStatus;
  until?: string;
} {
  if (!weeklyHours || typeof weeklyHours !== 'object') {
    return { status: 'OPEN' };
  }

  const hours = weeklyHours as Record<string, string>;
  const dayKey = DAY_KEYS[new Date().getDay()] ?? 'monday';
  const todayHours = hours[dayKey];

  if (!todayHours || todayHours.toUpperCase() === 'CLOSED') {
    return { status: 'CLOSED' };
  }

  const [openRaw = '', closeRaw = ''] = todayHours
    .split('-')
    .map((part) => part.trim());
  const openMinutes = parseTimeToMinutes(openRaw);
  const closeMinutes = parseTimeToMinutes(closeRaw);

  if (openMinutes == null || closeMinutes == null) {
    return { status: 'OPEN', until: closeRaw };
  }

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  if (nowMinutes < openMinutes || nowMinutes > closeMinutes) {
    return { status: 'CLOSED' };
  }

  if (closeMinutes - nowMinutes <= 60) {
    return { status: 'CLOSING_SOON', until: closeRaw };
  }

  return { status: 'OPEN', until: closeRaw };
}

export function formatCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category.replace(/_/g, ' ');
}

export function formatPrice(value: unknown): number {
  if (value == null) return 0;
  return Number(value);
}
