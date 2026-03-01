import { create } from "zustand";

interface AddMenuItemModalUIState {
  /** Drop zone drag state */
  isDragging: boolean;
  setDragging: (value: boolean) => void;
  /** Reset UI state when modal closes */
  reset: () => void;
}

export const useAddMenuItemModalStore = create<AddMenuItemModalUIState>((set) => ({
  isDragging: false,
  setDragging: (value) => set({ isDragging: value }),
  reset: () => set({ isDragging: false }),
}));
