import { useState } from "react";
import { Link } from "react-router-dom";
import { Truck } from "@/types/truck";
import { useDeleteTruck } from "@/hooks/trucks";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { cn } from "@/lib/cn";
import { STATUS_LABELS, STATUS_STYLES } from "@/lib/truckStatus";

const COLUMNS = ["Code", "Name", "Status", "Description", "Actions"] as const;

const SKELETON_CELL_WIDTHS: Record<(typeof COLUMNS)[number], number> = {
  Code: 60,
  Name: 80,
  Status: 90,
  Description: 140,
  Actions: 50,
};

const SKELETON_ROW_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4"] as const;

const SkeletonRow = () => (
  <tr className="border-t border-gray-100 dark:border-gray-700">
    {COLUMNS.map((col) => (
      <td key={col} className="px-4 py-3">
        <div
          className="h-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"
          style={{ width: `${SKELETON_CELL_WIDTHS[col]}px` }}
        />
      </td>
    ))}
  </tr>
);

interface TrucksListProps {
  trucks: Truck[];
  isLoading: boolean;
  isError: boolean;
}

const renderRows = (
  trucks: Truck[],
  onDeleteClick: (truck: Truck) => void,
  isLoading: boolean,
) => {
  if (isLoading) {
    return SKELETON_ROW_KEYS.map((key) => <SkeletonRow key={key} />);
  }

  if (trucks.length === 0) {
    return (
      <tr>
        <td
          colSpan={5}
          className="py-16 text-center text-sm text-gray-400 dark:text-gray-500"
        >
          No trucks found. Add one above.
        </td>
      </tr>
    );
  }

  return trucks.map((truck) => (
    <tr
      key={truck.id}
      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30"
    >
      <td className="px-4 py-3 font-mono font-medium">
        <Link
          to={`/trucks/${truck.id}`}
          className="text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
        >
          {truck.code}
        </Link>
      </td>
      <td className="px-4 py-3">
        <Link
          to={`/trucks/${truck.id}`}
          className="text-gray-800 transition-colors hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
        >
          {truck.name}
        </Link>
      </td>
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
            STATUS_STYLES[truck.status],
          )}
        >
          {STATUS_LABELS[truck.status]}
        </span>
      </td>
      <td className="max-w-xs truncate px-4 py-3 text-gray-500 dark:text-gray-400">
        {truck.description || "—"}
      </td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={() => onDeleteClick(truck)}
          className="text-sm font-medium text-red-500 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          Delete
        </button>
      </td>
    </tr>
  ));
};

export const TrucksList = ({
  trucks = [],
  isLoading,
  isError,
}: TrucksListProps) => {
  const deleteTruck = useDeleteTruck();
  const [pendingTruck, setPendingTruck] = useState<Truck | null>(null);

  const handleConfirmDelete = () => {
    if (!pendingTruck) return;
    deleteTruck.mutate(pendingTruck.id, {
      onSettled: () => setPendingTruck(null),
    });
  };

  return (
    <>
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
          Fleet {!isLoading && `(${trucks.length})`}
        </h2>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {isError ? (
            <div className="py-16 text-center text-sm text-red-500 dark:text-red-400">
              Failed to load trucks. Please try again.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Fleet trucks">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/50">
                    {COLUMNS.map((col) => (
                      <th
                        key={col}
                        className={cn(
                          "px-4 py-3 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400",
                          col === "Actions" ? "text-right" : "text-left",
                        )}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {renderRows(trucks, setPendingTruck, isLoading)}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <ConfirmDialog
        isOpen={pendingTruck !== null}
        title="Delete Truck"
        message={`Are you sure you want to delete "${pendingTruck?.name} (${pendingTruck?.code})"? This action cannot be undone.`}
        confirmLabel="Delete"
        isPending={deleteTruck.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingTruck(null)}
      />
    </>
  );
};
