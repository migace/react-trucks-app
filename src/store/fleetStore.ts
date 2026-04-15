import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TruckStatus } from "@/types/truck";

export type StatusFilter = TruckStatus | "ALL";

interface FleetStore {
  darkMode: boolean;
  toggleDarkMode: () => void;
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
}

export const useFleetStore = create<FleetStore>()(
  persist(
    (set) => ({
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      statusFilter: "ALL",
      setStatusFilter: (filter) => set({ statusFilter: filter }),
    }),
    {
      name: "fleet-store",
      partialize: (state) => ({ darkMode: state.darkMode }),
    },
  ),
);
