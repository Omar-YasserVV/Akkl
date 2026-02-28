import { create } from "zustand";

interface OverviewState {
    activeChartIndex: number;
    setActiveChartIndex: (index: number) => void;
}

export const useOverviewStore = create<OverviewState>((set) => ({
    activeChartIndex: 0,
    setActiveChartIndex: (index) => set({ activeChartIndex: index }),
}));
