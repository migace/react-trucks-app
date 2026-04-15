import { Truck, TruckStatus } from "@/types/truck";
import { env } from "@/env";

const API_URL = env.VITE_API_URL;

export interface CreateTruckPayload {
  code: string;
  name: string;
  status: TruckStatus;
  description: string;
}

export const fetchTrucks = async (): Promise<Truck[]> => {
  const res = await fetch(`${API_URL}/trucks`);
  if (!res.ok) throw new Error("Failed to fetch trucks");
  return res.json();
};

export const createTruck = async (
  payload: CreateTruckPayload,
): Promise<Truck> => {
  const res = await fetch(`${API_URL}/trucks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create truck");
  return res.json();
};

export const fetchTruck = async (truckId: string): Promise<Truck> => {
  const res = await fetch(`${API_URL}/trucks/${truckId}`);
  if (!res.ok) throw new Error("Failed to fetch truck");
  return res.json();
};

export const deleteTruck = async (truckId: string): Promise<void> => {
  const res = await fetch(`${API_URL}/trucks/${truckId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete truck");
};
