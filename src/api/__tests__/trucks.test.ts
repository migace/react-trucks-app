import { http, HttpResponse } from "msw";
import { server } from "@/test/mocks/server";
import { mockTrucks } from "@/test/mocks/handlers";
import {
  fetchTrucks,
  fetchTruck,
  createTruck,
  deleteTruck,
} from "@/api/trucks";

describe("API: trucks", () => {
  describe("fetchTrucks", () => {
    it("returns an array of trucks", async () => {
      const trucks = await fetchTrucks();
      expect(trucks).toEqual(mockTrucks);
    });

    it("throws on server error", async () => {
      server.use(
        http.get("http://localhost:3000/trucks", () => {
          return new HttpResponse(null, { status: 500 });
        }),
      );
      await expect(fetchTrucks()).rejects.toThrow("Failed to fetch trucks");
    });
  });

  describe("fetchTruck", () => {
    it("returns a single truck by id", async () => {
      const truck = await fetchTruck("1");
      expect(truck).toEqual(mockTrucks[0]);
    });

    it("throws on 404", async () => {
      await expect(fetchTruck("non-existent")).rejects.toThrow(
        "Failed to fetch truck",
      );
    });
  });

  describe("createTruck", () => {
    it("sends POST and returns created truck", async () => {
      const payload = {
        code: "NEW-001",
        name: "New Truck",
        status: "LOADING" as const,
        description: "A new truck",
      };
      const result = await createTruck(payload);
      expect(result).toMatchObject({
        id: "new-1",
        ...payload,
      });
    });

    it("throws on server error", async () => {
      server.use(
        http.post("http://localhost:3000/trucks", () => {
          return new HttpResponse(null, { status: 500 });
        }),
      );
      await expect(
        createTruck({
          code: "X",
          name: "Test",
          status: "LOADING",
          description: "",
        }),
      ).rejects.toThrow("Failed to create truck");
    });
  });

  describe("deleteTruck", () => {
    it("sends DELETE request successfully", async () => {
      await expect(deleteTruck("1")).resolves.toBeUndefined();
    });

    it("throws on server error", async () => {
      server.use(
        http.delete("http://localhost:3000/trucks/:id", () => {
          return new HttpResponse(null, { status: 500 });
        }),
      );
      await expect(deleteTruck("1")).rejects.toThrow("Failed to delete truck");
    });
  });
});
