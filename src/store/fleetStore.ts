import { create } from "zustand";
import { TruckStatus } from "@/types/truck";

export type StatusFilter = TruckStatus | "ALL";

interface FleetStore {
  darkMode: boolean;
  toggleDarkMode: () => void;
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
}

export const useFleetStore = create<FleetStore>((set) => ({
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  statusFilter: "ALL",
  setStatusFilter: (filter) => set({ statusFilter: filter }),
}));
