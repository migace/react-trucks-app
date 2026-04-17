import { z } from "zod";

export const TRUCK_STATUSES = [
  "OUT_OF_SERVICE",
  "LOADING",
  "TO_JOB",
  "AT_JOB",
  "RETURNING",
] as const;

export type TruckStatus = (typeof TRUCK_STATUSES)[number];

const truckStatusSchema = z.enum(TRUCK_STATUSES, {
  message: "Status is required",
});

export const truckSchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .max(20, "Code must be 20 characters or less"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be 50 characters or less"),
  status: truckStatusSchema,
  description: z
    .string()
    .max(200, "Description must be 200 characters or less"),
});

export type TruckFormData = z.infer<typeof truckSchema>;

export const truckResponseSchema = z.object({
  id: z.coerce.string(),
  code: z.string(),
  name: z.string(),
  status: truckStatusSchema,
  description: z.string(),
});

export const trucksResponseSchema = z.array(truckResponseSchema);
