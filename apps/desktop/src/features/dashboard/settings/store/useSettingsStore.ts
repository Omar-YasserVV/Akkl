import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultSettingsData } from "../static/settingsDefaults";
import type {
  BranchIdentitySettings,
  DiningTable,
  DiningZone,
  DiningZoneType,
  HardwareDevice,
  OperatingHoursSettings,
  SettingsOnboardingData,
  SettingsStepId,
  WeekDaySchedule,
  GetBranchDetailsResponse,
} from "../types/settings.types";
import {
  getStepIdFromActiveStep,
  mapBranchDetailsToSettingsData,
} from "../utils/settingsMappers";

type SettingsStore = {
  activeStepId: SettingsStepId;
  isOnboardingComplete: boolean;
  isEditingExistingBranch: boolean;
  branchDetails: GetBranchDetailsResponse | null;
  data: SettingsOnboardingData;
  hydrateFromBranchDetails: (branchDetails: GetBranchDetailsResponse) => void;
  setActiveStepId: (stepId: SettingsStepId) => void;
  completeOnboarding: () => void;
  reopenOnboarding: () => void;
  updateBranchIdentity: (updates: Partial<BranchIdentitySettings>) => void;
  updateOperatingHours: (updates: Partial<OperatingHoursSettings>) => void;
  updateDaySchedule: (dayId: string, updates: Partial<WeekDaySchedule>) => void;
  updateBusyMode: (
    updates: Partial<SettingsOnboardingData["operatingHours"]["busyMode"]>,
  ) => void;
  setSelectedZoneType: (zoneType: DiningZoneType) => void;
  addZone: (zone: DiningZone) => void;
  updateZone: (zoneId: string, updates: Partial<DiningZone>) => void;
  removeZone: (zoneId: string) => void;
  addTable: (zoneId: string, table: DiningTable) => void;
  updateTable: (
    zoneId: string,
    tableId: string,
    updates: Partial<DiningTable>,
  ) => void;
  removeTable: (zoneId: string, tableId: string) => void;
  updateHardwareDevice: (
    deviceId: string,
    updates: Partial<HardwareDevice>,
  ) => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      activeStepId: "branch-identity",
      isOnboardingComplete: false,
      isEditingExistingBranch: false,
      branchDetails: null,
      data: defaultSettingsData,
      hydrateFromBranchDetails: (branchDetails) =>
        set({
          branchDetails,
          activeStepId: getStepIdFromActiveStep(branchDetails.activeStep),
          isOnboardingComplete: branchDetails.activeStep >= 4,
          isEditingExistingBranch: false,
          data: mapBranchDetailsToSettingsData(branchDetails),
        }),
      setActiveStepId: (activeStepId) => set({ activeStepId }),
      completeOnboarding: () =>
        set({
          isOnboardingComplete: true,
          isEditingExistingBranch: false,
        }),
      reopenOnboarding: () =>
        set({
          activeStepId: "branch-identity",
          isOnboardingComplete: false,
          isEditingExistingBranch: true,
        }),
      updateBranchIdentity: (updates) =>
        set((state) => ({
          data: {
            ...state.data,
            branchIdentity: { ...state.data.branchIdentity, ...updates },
          },
        })),
      updateOperatingHours: (updates) =>
        set((state) => ({
          data: {
            ...state.data,
            operatingHours: { ...state.data.operatingHours, ...updates },
          },
        })),
      updateDaySchedule: (dayId, updates) =>
        set((state) => ({
          data: {
            ...state.data,
            operatingHours: {
              ...state.data.operatingHours,
              weeklySchedule: state.data.operatingHours.weeklySchedule.map(
                (day) => (day.id === dayId ? { ...day, ...updates } : day),
              ),
            },
          },
        })),
      updateBusyMode: (updates) =>
        set((state) => ({
          data: {
            ...state.data,
            operatingHours: {
              ...state.data.operatingHours,
              busyMode: { ...state.data.operatingHours.busyMode, ...updates },
            },
          },
        })),
      setSelectedZoneType: (selectedZoneType) =>
        set((state) => ({
          data: {
            ...state.data,
            floorPlan: { ...state.data.floorPlan, selectedZoneType },
          },
        })),
      addZone: (zone) =>
        set((state) => ({
          data: {
            ...state.data,
            floorPlan: {
              ...state.data.floorPlan,
              zones: [...state.data.floorPlan.zones, zone],
            },
          },
        })),
      updateZone: (zoneId, updates) =>
        set((state) => ({
          data: {
            ...state.data,
            floorPlan: {
              ...state.data.floorPlan,
              zones: state.data.floorPlan.zones.map((zone) =>
                zone.id === zoneId ? { ...zone, ...updates } : zone,
              ),
            },
          },
        })),
      removeZone: (zoneId) =>
        set((state) => ({
          data: {
            ...state.data,
            floorPlan: {
              ...state.data.floorPlan,
              zones: state.data.floorPlan.zones.filter(
                (zone) => zone.id !== zoneId,
              ),
            },
          },
        })),
      addTable: (zoneId, table) =>
        set((state) => ({
          data: {
            ...state.data,
            floorPlan: {
              ...state.data.floorPlan,
              zones: state.data.floorPlan.zones.map((zone) =>
                zone.id === zoneId
                  ? { ...zone, tables: [...zone.tables, table] }
                  : zone,
              ),
            },
          },
        })),
      updateTable: (zoneId, tableId, updates) =>
        set((state) => ({
          data: {
            ...state.data,
            floorPlan: {
              ...state.data.floorPlan,
              zones: state.data.floorPlan.zones.map((zone) =>
                zone.id === zoneId
                  ? {
                      ...zone,
                      tables: zone.tables.map((table) =>
                        table.id === tableId ? { ...table, ...updates } : table,
                      ),
                    }
                  : zone,
              ),
            },
          },
        })),
      removeTable: (zoneId, tableId) =>
        set((state) => ({
          data: {
            ...state.data,
            floorPlan: {
              ...state.data.floorPlan,
              zones: state.data.floorPlan.zones.map((zone) =>
                zone.id === zoneId
                  ? {
                      ...zone,
                      tables: zone.tables.filter(
                        (table) => table.id !== tableId,
                      ),
                    }
                  : zone,
              ),
            },
          },
        })),
      updateHardwareDevice: (deviceId, updates) =>
        set((state) => ({
          data: {
            ...state.data,
            hardware: {
              devices: state.data.hardware.devices.map((device) =>
                device.id === deviceId ? { ...device, ...updates } : device,
              ),
            },
          },
        })),
    }),
    {
      name: "akkl-settings-onboarding",
      partialize: (state) => ({
        activeStepId: state.activeStepId,
        isOnboardingComplete: state.isOnboardingComplete,
        isEditingExistingBranch: state.isEditingExistingBranch,
        branchDetails: state.branchDetails,
        data: state.data,
      }),
    },
  ),
);
