import { create } from "zustand";

interface FinanceState {
    activeChartIndex: number;
    setActiveChartIndex: (index: number) => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
    activeChartIndex: 0,
    setActiveChartIndex: (index) => set({ activeChartIndex: index }),
}));
