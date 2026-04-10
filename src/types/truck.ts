export type TruckStatus =
  | "OUT_OF_SERVICE"
  | "LOADING"
  | "TO_JOB"
  | "AT_JOB"
  | "RETURNING";

export interface Truck {
  id: string;
  code: string;
  name: string;
  status: TruckStatus;
  description: string;
}
