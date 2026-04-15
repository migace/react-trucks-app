import { useMemo } from "react";
import { TrucksList } from "@/components/TrucksList";
import { useTrucks } from "@/hooks/trucks";
import { useFleetStore, StatusFilter } from "@/store/fleetStore";
import { TRUCK_STATUSES } from "@/schemas/truck";
import { FILTER_LABELS } from "@/lib/truckStatus";
import { cn } from "@/lib/cn";

const ALL_FILTERS: StatusFilter[] = ["ALL", ...TRUCK_STATUSES];

export const FleetPage = () => {
  const { data: trucks = [], isLoading, isError } = useTrucks();
  const { statusFilter, setStatusFilter } = useFleetStore();

  const countByStatus = useMemo(() => {
    const counts: Record<string, number> = { ALL: trucks.length };
    for (const t of trucks) {
      counts[t.status] = (counts[t.status] ?? 0) + 1;
    }
    return counts;
  }, [trucks]);

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
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                statusFilter === filter
                  ? "bg-blue-600 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400",
              )}
            >
              {FILTER_LABELS[filter]}
              {!isLoading && (
                <span className="ml-1.5 opacity-70">
                  {countByStatus[filter] ?? 0}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <TrucksList
        trucks={filteredTrucks}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
};
