import { Link } from "react-router-dom";
import { TrucksList } from "@/components/TrucksList";
import { useTrucks } from "@/hooks/trucks";
import { useFleetStore, StatusFilter } from "@/store/fleetStore";
import { TRUCK_STATUSES } from "@/schemas/truck";

const ALL_FILTERS: StatusFilter[] = ["ALL", ...TRUCK_STATUSES];

const FILTER_LABELS: Record<StatusFilter, string> = {
  ALL: "All",
  OUT_OF_SERVICE: "Out of Service",
  LOADING: "Loading",
  TO_JOB: "To Job",
  AT_JOB: "At Job",
  RETURNING: "Returning",
};

export const FleetPage = () => {
  const { data: trucks = [], isLoading, isError } = useTrucks();
  const { statusFilter, setStatusFilter } = useFleetStore();

  const filteredTrucks =
    statusFilter === "ALL"
      ? trucks
      : trucks.filter((t) => t.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {ALL_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === filter
                  ? "bg-blue-600 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              {FILTER_LABELS[filter]}
              {!isLoading && filter === "ALL" && (
                <span className="ml-1.5 opacity-70">{trucks.length}</span>
              )}
              {!isLoading && filter !== "ALL" && (
                <span className="ml-1.5 opacity-70">
                  {trucks.filter((t) => t.status === filter).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <Link
          to="/trucks/new"
          className="hidden items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 sm:flex"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Truck
        </Link>
      </div>

      <TrucksList
        trucks={filteredTrucks}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
};
