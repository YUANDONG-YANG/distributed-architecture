import { create } from 'zustand';

/** Shell-only UI state (tab selection). Simulation stores will live alongside later. */
export const useUiStore = create((set) => ({
  activeTab: 'transaction',
  setActiveTab: (activeTab) => set({ activeTab }),
}));
