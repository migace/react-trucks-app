import { z } from "zod";
import { truckResponseSchema } from "@/schemas/truck";

export type { TruckStatus } from "@/schemas/truck";
export type Truck = z.infer<typeof truckResponseSchema>;
