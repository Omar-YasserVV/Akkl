import type { IconType } from "react-icons";

export type SettingsStepId =
  | "branch-identity"
  | "operating-hours"
  | "floor-plan"
  | "hardware-connecting";

export type ServiceMode = "Dine in" | "Pickup" | "Delivery";

export type OrderChannel = "POS" | "QR menu" | "Website" | "Delivery apps";

export type BranchIdentitySettings = {
  branchName: string;
  branchCode: string;
  phone: string;
  address: string;
  cuisineType: string;
  serviceModes: ServiceMode[];
  orderChannels: OrderChannel[];
};

export type WeekDaySchedule = {
  id: string;
  label: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
};

export type BusyModeSettings = {
  isEnabled: boolean;
  activeOrderThreshold: number;
  holidayClosure: boolean;
};

export type OperatingHoursSettings = {
  weeklySchedule: WeekDaySchedule[];
  busyMode: BusyModeSettings;
};

export type TableStatus = "Available" | "Reserved";

export type DiningZoneType = "Indoor" | "Outdoor" | "Terrace";

export type DiningTable = {
  id: string;
  name: string;
  capacity: number;
  status: TableStatus;
};

export type DiningZone = {
  id: string;
  name: string;
  type: DiningZoneType;
  tables: DiningTable[];
};

export type FloorPlanSettings = {
  selectedZoneType: DiningZoneType;
  zones: DiningZone[];
};

export type HardwareDeviceStatus = "Connected" | "Optional" | "Needs setup";

export type HardwareDevice = {
  id: string;
  name: string;
  description: string;
  status: HardwareDeviceStatus;
  isEnabled: boolean;
};

export type HardwareSettings = {
  devices: HardwareDevice[];
};

export type SettingsOnboardingData = {
  branchIdentity: BranchIdentitySettings;
  operatingHours: OperatingHoursSettings;
  floorPlan: FloorPlanSettings;
  hardware: HardwareSettings;
};

export type SettingsStep = {
  id: SettingsStepId;
  title: string;
  eyebrow: string;
  description: string;
  icon: IconType;
};
