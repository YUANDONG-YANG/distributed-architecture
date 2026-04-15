import { create } from 'zustand';

/** Shell-only UI state (tab selection). Simulation stores live alongside. */
export const useUiStore = create((set) => ({
  activeTab: 'transaction',
  setActiveTab: (activeTab) => set({ activeTab }),
}));
