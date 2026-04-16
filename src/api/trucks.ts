import { Truck } from "@/types/truck";
import {
  TruckFormData,
  truckResponseSchema,
  trucksResponseSchema,
} from "@/schemas/truck";
import { env } from "@/env";

const API_URL = env.VITE_API_URL;
const REQUEST_TIMEOUT_MS = 10_000;

export type CreateTruckPayload = TruckFormData;

export const fetchTrucks = async (): Promise<Truck[]> => {
  const res = await fetch(`${API_URL}/trucks`, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Failed to fetch trucks (${res.status})`);
  const data: unknown = await res.json();
  return trucksResponseSchema.parse(data);
};

export const createTruck = async (
  payload: CreateTruckPayload,
): Promise<Truck> => {
  const res = await fetch(`${API_URL}/trucks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Failed to create truck (${res.status})`);
  const data: unknown = await res.json();
  return truckResponseSchema.parse(data);
};

export const fetchTruck = async (truckId: string): Promise<Truck> => {
  const res = await fetch(`${API_URL}/trucks/${truckId}`, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Failed to fetch truck (${res.status})`);
  const data: unknown = await res.json();
  return truckResponseSchema.parse(data);
};

export const deleteTruck = async (truckId: string): Promise<void> => {
  const res = await fetch(`${API_URL}/trucks/${truckId}`, {
    method: "DELETE",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Failed to delete truck (${res.status})`);
};
