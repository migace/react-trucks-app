import { TruckStatus } from "@/types/truck";

export const STATUS_STYLES: Record<TruckStatus, string> = {
  OUT_OF_SERVICE:
    "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  LOADING:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  TO_JOB: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  AT_JOB:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  RETURNING:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export const STATUS_LABELS: Record<TruckStatus, string> = {
  OUT_OF_SERVICE: "Out of Service",
  LOADING: "Loading",
  TO_JOB: "To Job",
  AT_JOB: "At Job",
  RETURNING: "Returning",
};

export const FILTER_LABELS: Record<TruckStatus | "ALL", string> = {
  ALL: "All",
  ...STATUS_LABELS,
};
