import { useFleetStore } from "@/store/fleetStore";

describe("fleetStore", () => {
  beforeEach(() => {
    useFleetStore.setState({ darkMode: false, statusFilter: "ALL" });
  });

  describe("initial state", () => {
    it("has darkMode set to false", () => {
      expect(useFleetStore.getState().darkMode).toBe(false);
    });

    it('has statusFilter set to "ALL"', () => {
      expect(useFleetStore.getState().statusFilter).toBe("ALL");
    });
  });

  describe("toggleDarkMode", () => {
    it("toggles darkMode to true", () => {
      useFleetStore.getState().toggleDarkMode();
      expect(useFleetStore.getState().darkMode).toBe(true);
    });

    it("toggles darkMode back to false", () => {
      useFleetStore.getState().toggleDarkMode();
      useFleetStore.getState().toggleDarkMode();
      expect(useFleetStore.getState().darkMode).toBe(false);
    });
  });

  describe("setStatusFilter", () => {
    it("updates the status filter", () => {
      useFleetStore.getState().setStatusFilter("LOADING");
      expect(useFleetStore.getState().statusFilter).toBe("LOADING");
    });

    it("can be set back to ALL", () => {
      useFleetStore.getState().setStatusFilter("AT_JOB");
      useFleetStore.getState().setStatusFilter("ALL");
      expect(useFleetStore.getState().statusFilter).toBe("ALL");
    });

    it("accepts all valid truck statuses", () => {
      const statuses = [
        "OUT_OF_SERVICE",
        "LOADING",
        "TO_JOB",
        "AT_JOB",
        "RETURNING",
      ] as const;
      for (const status of statuses) {
        useFleetStore.getState().setStatusFilter(status);
        expect(useFleetStore.getState().statusFilter).toBe(status);
      }
    });
  });
});
