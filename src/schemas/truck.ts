import { z } from "zod";

export const TRUCK_STATUSES = [
  "OUT_OF_SERVICE",
  "LOADING",
  "TO_JOB",
  "AT_JOB",
  "RETURNING",
] as const;

export const truckSchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .max(20, "Code must be 20 characters or less"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be 50 characters or less"),
  status: z.enum(TRUCK_STATUSES, {
    message: "Status is required",
  }),
  description: z
    .string()
    .max(200, "Description must be 200 characters or less"),
});

export type TruckFormData = z.infer<typeof truckSchema>;
