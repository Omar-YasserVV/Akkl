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
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  const twentyFourHourMatch = trimmed.match(/^(\d{1,2}):(\d{2})$/);

  if (twentyFourHourMatch) {
    const hours = Number(twentyFourHourMatch[1]);
    const minutes = Number(twentyFourHourMatch[2]);
    if (hours > 23 || minutes > 59) return null;
    return hours * 60 + minutes;
  }

  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]!.toUpperCase();
  if (hours > 12 || minutes > 59) return null;
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function normalizeDayHours(value: unknown): string | null {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return null;

  const dayHours = value as {
    open?: unknown;
    close?: unknown;
    isClosed?: unknown;
    closed?: unknown;
  };

  if (dayHours.isClosed === true || dayHours.closed === true) {
    return 'CLOSED';
  }

  if (typeof dayHours.open === 'string' && typeof dayHours.close === 'string') {
    return `${dayHours.open} - ${dayHours.close}`;
  }

  return null;
}

export function getBranchOpenStatus(weeklyHours: unknown): {
  status: OpenStatus;
  until?: string;
} {
  if (!weeklyHours || typeof weeklyHours !== 'object') {
    return { status: 'OPEN' };
  }

  const hours = weeklyHours as Record<string, unknown>;
  const dayKey = DAY_KEYS[new Date().getDay()] ?? 'monday';
  const todayHours = normalizeDayHours(hours[dayKey]);

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
  const closeMinutesToday =
    closeMinutes <= openMinutes ? closeMinutes + 24 * 60 : closeMinutes;
  const nowMinutesToday =
    closeMinutes <= openMinutes && nowMinutes < openMinutes
      ? nowMinutes + 24 * 60
      : nowMinutes;

  if (nowMinutesToday < openMinutes || nowMinutesToday > closeMinutesToday) {
    return { status: 'CLOSED' };
  }

  if (closeMinutesToday - nowMinutesToday <= 60) {
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
