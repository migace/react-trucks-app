import { truckSchema, TRUCK_STATUSES } from "@/schemas/truck";

const validTruck = {
  code: "TRK-001",
  name: "Volvo FH16",
  status: "AT_JOB" as const,
  description: "Main delivery truck",
};

describe("truckSchema", () => {
  it("accepts valid truck data", () => {
    const result = truckSchema.safeParse(validTruck);
    expect(result.success).toBe(true);
  });

  it("accepts empty description", () => {
    const result = truckSchema.safeParse({ ...validTruck, description: "" });
    expect(result.success).toBe(true);
  });

  describe("code validation", () => {
    it("rejects empty code", () => {
      const result = truckSchema.safeParse({ ...validTruck, code: "" });
      expect(result.success).toBe(false);
    });

    it("rejects code longer than 20 characters", () => {
      const result = truckSchema.safeParse({
        ...validTruck,
        code: "A".repeat(21),
      });
      expect(result.success).toBe(false);
    });

    it("accepts code with exactly 20 characters", () => {
      const result = truckSchema.safeParse({
        ...validTruck,
        code: "A".repeat(20),
      });
      expect(result.success).toBe(true);
    });

    it("accepts single character code", () => {
      const result = truckSchema.safeParse({ ...validTruck, code: "A" });
      expect(result.success).toBe(true);
    });
  });

  describe("name validation", () => {
    it("rejects name shorter than 2 characters", () => {
      const result = truckSchema.safeParse({ ...validTruck, name: "A" });
      expect(result.success).toBe(false);
    });

    it("rejects empty name", () => {
      const result = truckSchema.safeParse({ ...validTruck, name: "" });
      expect(result.success).toBe(false);
    });

    it("accepts name with exactly 2 characters", () => {
      const result = truckSchema.safeParse({ ...validTruck, name: "AB" });
      expect(result.success).toBe(true);
    });

    it("rejects name longer than 50 characters", () => {
      const result = truckSchema.safeParse({
        ...validTruck,
        name: "A".repeat(51),
      });
      expect(result.success).toBe(false);
    });

    it("accepts name with exactly 50 characters", () => {
      const result = truckSchema.safeParse({
        ...validTruck,
        name: "A".repeat(50),
      });
      expect(result.success).toBe(true);
    });
  });

  describe("status validation", () => {
    it.each(TRUCK_STATUSES)("accepts valid status: %s", (status) => {
      const result = truckSchema.safeParse({ ...validTruck, status });
      expect(result.success).toBe(true);
    });

    it("rejects invalid status", () => {
      const result = truckSchema.safeParse({
        ...validTruck,
        status: "INVALID",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("description validation", () => {
    it("rejects description longer than 200 characters", () => {
      const result = truckSchema.safeParse({
        ...validTruck,
        description: "A".repeat(201),
      });
      expect(result.success).toBe(false);
    });

    it("accepts description with exactly 200 characters", () => {
      const result = truckSchema.safeParse({
        ...validTruck,
        description: "A".repeat(200),
      });
      expect(result.success).toBe(true);
    });
  });
});
