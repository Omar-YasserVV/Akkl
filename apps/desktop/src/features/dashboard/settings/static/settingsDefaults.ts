import {
  LuBuilding2,
  LuCalendarClock,
  LuGrid3X3,
  LuPrinter,
} from "react-icons/lu";
import type {
  DiningZone,
  HardwareDevice,
  OrderChannel,
  ServiceMode,
  SettingsOnboardingData,
  SettingsStep,
  WeekDaySchedule,
} from "../types/settings.types";

export const serviceModeOptions: ServiceMode[] = [
  "Dine in",
  "Pickup",
  "Delivery",
];

export const orderChannelOptions: OrderChannel[] = [
  "POS",
  "QR menu",
  "Website",
  "Delivery apps",
];

export const settingsSteps: SettingsStep[] = [
  {
    id: "branch-identity",
    eyebrow: "Step 1 of 4",
    title: "Branch identity",
    description:
      "Add the details customers and staff will see across orders, receipts, and reports.",
    icon: LuBuilding2,
  },
  {
    id: "operating-hours",
    eyebrow: "Step 2 of 4",
    title: "Operating hours",
    description:
      "Tell us when your kitchen is open for orders. You can adjust these later in settings.",
    icon: LuCalendarClock,
  },
  {
    id: "floor-plan",
    eyebrow: "Step 3 of 4",
    title: "Floor plan and tables",
    description:
      "Define your dining areas and the tables within them to manage seating effectively.",
    icon: LuGrid3X3,
  },
  {
    id: "hardware-connecting",
    eyebrow: "Step 4 of 4",
    title: "Hardware connecting",
    description:
      "Choose the devices this branch uses so orders, payments, and kitchen tickets flow cleanly.",
    icon: LuPrinter,
  },
];

export const defaultWeeklySchedule: WeekDaySchedule[] = [
  {
    id: "monday",
    label: "Monday",
    isOpen: true,
    openTime: "09:00",
    closeTime: "21:00",
  },
  {
    id: "tuesday",
    label: "Tuesday",
    isOpen: true,
    openTime: "09:00",
    closeTime: "21:00",
  },
  {
    id: "wednesday",
    label: "Wednesday",
    isOpen: true,
    openTime: "09:00",
    closeTime: "21:00",
  },
  {
    id: "thursday",
    label: "Thursday",
    isOpen: true,
    openTime: "09:00",
    closeTime: "21:00",
  },
  {
    id: "friday",
    label: "Friday",
    isOpen: true,
    openTime: "09:00",
    closeTime: "23:00",
  },
  {
    id: "saturday",
    label: "Saturday",
    isOpen: true,
    openTime: "10:00",
    closeTime: "23:00",
  },
  {
    id: "sunday",
    label: "Sunday",
    isOpen: false,
    openTime: "10:00",
    closeTime: "20:00",
  },
];

export const defaultDiningZones: DiningZone[] = [
  {
    id: "indoor-dining",
    name: "Indoor Dining",
    type: "Indoor",
    tables: [
      { id: "table-1", name: "Table 1", capacity: 4, status: "Available" },
      { id: "table-2", name: "Table 2", capacity: 2, status: "Available" },
    ],
  },
  {
    id: "outdoor-patio",
    name: "Outdoor Patio",
    type: "Outdoor",
    tables: [
      { id: "patio-1", name: "Patio 1", capacity: 6, status: "Available" },
    ],
  },
];

export const defaultHardwareDevices: HardwareDevice[] = [
  {
    id: "kitchen-line-01",
    name: "Kitchen Line 01",
    description: "Kitchen Display System at 192.168.1.45 running v2.4.1.",
    status: "Connected",
    isEnabled: true,
  },
  {
    id: "prep-station-b",
    name: "Prep Station B",
    description: "Kitchen Display System discovered at 192.168.1.48.",
    status: "Needs setup",
    isEnabled: false,
  },
  {
    id: "main-bar-thermal",
    name: "Main Bar Thermal",
    description: "Epson TM-T88VI receipt printer at 192.168.1.102.",
    status: "Connected",
    isEnabled: true,
  },
];

export const defaultSettingsData: SettingsOnboardingData = {
  branchIdentity: {
    branchName: "Downtown Branch",
    branchCode: "AKK-001",
    phone: "+20 100 000 0000",
    address: "12 Nile Street, Cairo",
    cuisineType: "Casual dining",
    serviceModes: ["Dine in", "Pickup"],
    orderChannels: ["POS", "QR menu"],
  },
  operatingHours: {
    weeklySchedule: defaultWeeklySchedule,
    busyMode: {
      isEnabled: true,
      activeOrderThreshold: 10,
      holidayClosure: false,
    },
  },
  floorPlan: {
    selectedZoneType: "Indoor",
    zones: defaultDiningZones,
  },
  hardware: {
    devices: defaultHardwareDevices,
  },
};
