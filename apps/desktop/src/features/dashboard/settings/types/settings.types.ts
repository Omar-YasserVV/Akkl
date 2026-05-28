import type { IconType } from "react-icons";

export type SettingsStepId =
  | "branch-identity"
  | "operating-hours"
  | "floor-plan"
  | "hardware-connecting";

export type ServiceMode = "Dine in" | "Pickup" | "Delivery";

export type OrderChannel = "POS" | "QR menu" | "Website" | "Delivery apps";

export type GetBranchDetailsResponse = {
  id: string;
  status: "DRAFT" | "ACTIVE" | "INACTIVE";
  branchNumber: string;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  weeklyHours: Partial<
    Record<
      | "monday"
      | "tuesday"
      | "wednesday"
      | "thursday"
      | "friday"
      | "saturday"
      | "sunday",
      string | WeekDayHours
    >
  > | null;
  busyModeSettings: {
    orderThreshold: number;
    autoBusyEnabled: boolean;
    extraPrepTimeMinutes: number;
  };
  haveTables: boolean;
  haveReservations: boolean;
  haveWarehouses: boolean;
  createdAt: string;
  updatedAt: string;
  restaurantId: string;
  tables: {
    id: string;
    tableNumber: string;
    capacity: number;
    zoneName: string;
    branchId: string;
  }[];
  warehouses: {
    id: string;
    name: string;
    branchId: string;
  } | null;
  hardware: {
    id: string;
    branchId: string;
    type: "KDS" | "PRINTER";
    name: string;
    ipAddress: string;
    createdAt: string;
  }[];
  activeStep: number;
};

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
  description?: string;
  isActive?: boolean;
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
export type WeekDayHours = {
  open: string;
  close: string;
};

export type OnboardingHardware = {
  type: "KDS" | "PRINTER";
  name: string;
  ipAddress: string;
};

export type OnboardingZone = {
  name: string;
  tables: {
    tableNumber: string;
    capacity: number;
  }[];
};

export type OnboardingBusyModeSettings = {
  autoBusyEnabled: boolean;
  orderThreshold: number;
  extraPrepTimeMinutes: number;
  holidayClosure: {
    enabled: boolean;
    reason: string;
  };
};

export type OnboardingBranchPayload = {
  name: string;
  address: string;
  phone: string;
  weeklyHours: Partial<
    Record<
      | "monday"
      | "tuesday"
      | "wednesday"
      | "thursday"
      | "friday"
      | "saturday"
      | "sunday",
      WeekDayHours
    >
  >;
  busyModeSettings: OnboardingBusyModeSettings;
  haveTables: boolean;
  zones: OnboardingZone[];
  haveReservations: boolean;
  haveWarehouses: boolean;
  warehouseName: string;
  hardware: OnboardingHardware[];
};

export type OnboardingBranchResponse = GetBranchDetailsResponse;
export type FinalizeBranchResponse = GetBranchDetailsResponse;
export type UpdateBranchPayload = OnboardingBranchPayload;
export type UpdateBranchResponse = OnboardingBranchResponse;
