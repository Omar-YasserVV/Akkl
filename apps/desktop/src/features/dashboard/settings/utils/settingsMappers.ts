import { defaultSettingsData } from "../static/settingsDefaults";
import type {
  DiningZone,
  DiningZoneType,
  GetBranchDetailsResponse,
  HardwareDevice,
  OnboardingBranchPayload,
  SettingsOnboardingData,
  WeekDaySchedule,
} from "../types/settings.types";

const weekDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const dayLabels: Record<(typeof weekDays)[number], string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

function parseTimeRange(value: string | { open: string; close: string } | undefined) {
  if (!value) {
    return { isOpen: false, openTime: "09:00", closeTime: "21:00" };
  }

  if (typeof value === "object") {
    const isClosed =
      value.open.toUpperCase() === "CLOSED" ||
      value.close.toUpperCase() === "CLOSED";

    return {
      isOpen: !isClosed,
      openTime: isClosed ? "09:00" : value.open,
      closeTime: isClosed ? "21:00" : value.close,
    };
  }

  if (value.toUpperCase() === "CLOSED") {
    return { isOpen: false, openTime: "09:00", closeTime: "21:00" };
  }

  const [openTime = "09:00", closeTime = "21:00"] = value
    .replace(/\s/g, "")
    .split("-");

  return { isOpen: true, openTime, closeTime };
}

function inferZoneType(zoneName: string): DiningZoneType {
  const normalized = zoneName.toLowerCase();

  if (normalized.includes("terrace")) return "Terrace";
  if (normalized.includes("outdoor") || normalized.includes("patio")) {
    return "Outdoor";
  }

  return "Indoor";
}

function mapWeeklyHours(
  weeklyHours: GetBranchDetailsResponse["weeklyHours"],
): WeekDaySchedule[] {
  return weekDays.map((day) => ({
    id: day,
    label: dayLabels[day],
    ...parseTimeRange(weeklyHours?.[day]),
  }));
}

function mapTablesToZones(
  tables: GetBranchDetailsResponse["tables"],
): DiningZone[] {
  const zones = new Map<string, DiningZone>();

  tables.forEach((table) => {
    const zoneType = inferZoneType(table.zoneName);
    const existingZone = zones.get(table.zoneName);

    if (!existingZone) {
      zones.set(table.zoneName, {
        id: table.zoneName.toLowerCase().replace(/\s+/g, "-"),
        name: table.zoneName,
        type: zoneType,
        isActive: true,
        tables: [],
      });
    }

    zones.get(table.zoneName)!.tables.push({
      id: table.id,
      name: table.tableNumber,
      capacity: table.capacity,
      status: "Available",
    });
  });

  return Array.from(zones.values());
}

function mapHardwareDevices(
  hardware: GetBranchDetailsResponse["hardware"],
): HardwareDevice[] {
  return hardware.map((device) => ({
    id: device.id,
    name: device.name,
    description: `${device.type} device at ${device.ipAddress}`,
    status: "Connected",
    isEnabled: true,
  }));
}

export function mapBranchDetailsToSettingsData(
  branch: GetBranchDetailsResponse,
): SettingsOnboardingData {
  const zones = mapTablesToZones(branch.tables);

  return {
    branchIdentity: {
      ...defaultSettingsData.branchIdentity,
      branchName: branch.name,
      branchCode: branch.branchNumber,
      phone: branch.phone ?? "",
      address: branch.address ?? "",
    },
    operatingHours: {
      weeklySchedule: mapWeeklyHours(branch.weeklyHours),
      busyMode: {
        isEnabled: branch.busyModeSettings.autoBusyEnabled,
        activeOrderThreshold: branch.busyModeSettings.orderThreshold,
        holidayClosure: defaultSettingsData.operatingHours.busyMode.holidayClosure,
      },
    },
    floorPlan: {
      selectedZoneType: zones[0]?.type ?? "Indoor",
      zones,
    },
    hardware: {
      devices: mapHardwareDevices(branch.hardware),
    },
  };
}

function mapScheduleToWeeklyHours(
  schedule: WeekDaySchedule[],
): OnboardingBranchPayload["weeklyHours"] {
  return Object.fromEntries(
    schedule.map((day) => [
      day.id,
      day.isOpen
        ? { open: day.openTime, close: day.closeTime }
        : { open: "CLOSED", close: "CLOSED" },
    ]),
  ) as OnboardingBranchPayload["weeklyHours"];
}

export function mapSettingsDataToBranchPayload(
  data: SettingsOnboardingData,
): OnboardingBranchPayload {
  const zones = data.floorPlan.zones.map((zone) => ({
    name: zone.name,
    tables: zone.tables.map((table) => ({
      tableNumber: table.name,
      capacity: table.capacity,
    })),
  }));

  return {
    name: data.branchIdentity.branchName,
    address: data.branchIdentity.address,
    phone: data.branchIdentity.phone,
    weeklyHours: mapScheduleToWeeklyHours(
      data.operatingHours.weeklySchedule,
    ),
    busyModeSettings: {
      autoBusyEnabled: data.operatingHours.busyMode.isEnabled,
      orderThreshold: data.operatingHours.busyMode.activeOrderThreshold,
      extraPrepTimeMinutes: 0,
      holidayClosure: {
        enabled: data.operatingHours.busyMode.holidayClosure,
        reason: data.operatingHours.busyMode.holidayClosure
          ? "Holiday closure"
          : "",
      },
    },
    haveTables: data.floorPlan.zones.some((zone) => zone.tables.length > 0),
    zones,
    haveReservations: false,
    haveWarehouses: true,
    warehouseName: "Main Warehouse",
    hardware: data.hardware.devices
      .filter((device) => device.isEnabled)
      .map((device) => ({
        type: device.name.toLowerCase().includes("printer")
          ? "PRINTER"
          : "KDS",
        name: device.name,
        ipAddress:
          device.description.match(
            /\b(?:\d{1,3}\.){3}\d{1,3}\b/,
          )?.[0] ?? "0.0.0.0",
      })),
  };
}

export function getStepIdFromActiveStep(activeStep: number) {
  if (activeStep <= 1) return "branch-identity";
  if (activeStep === 2) return "operating-hours";
  if (activeStep === 3) return "floor-plan";
  return "hardware-connecting";
}
