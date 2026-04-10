import { useState } from "react";
import { Truck, TruckStatus } from "@/types/truck";
import { useDeleteTruck } from "@/hooks/trucks";
import { ConfirmDialog } from "@/components/ConfirmDialog";

const STATUS_STYLES: Record<TruckStatus, string> = {
  OUT_OF_SERVICE: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  LOADING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  TO_JOB: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  AT_JOB: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  RETURNING: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const COLUMNS = ["Code", "Name", "Status", "Description", "Actions"] as const;

const SKELETON_CELL_WIDTHS: Record<typeof COLUMNS[number], number> = {
  Code: 60, Name: 80, Status: 90, Description: 140, Actions: 50,
};

const SKELETON_ROW_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4"] as const;

const SkeletonRow = () => (
  <tr className="border-t border-gray-100 dark:border-gray-700">
    {COLUMNS.map((col) => (
      <td key={col} className="px-4 py-3">
        <div
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
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
  isLoading: boolean
) => {
  if (isLoading) {
    return SKELETON_ROW_KEYS.map((key) => <SkeletonRow key={key} />);
  }

  if (trucks.length === 0) {
    return (
      <tr>
        <td colSpan={5} className="py-16 text-center text-gray-400 dark:text-gray-500 text-sm">
          No trucks found. Add one above.
        </td>
      </tr>
    );
  }

  return trucks.map((truck) => (
    <tr key={truck.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
      <td className="px-4 py-3 font-mono text-gray-700 dark:text-gray-200 font-medium">
        {truck.code}
      </td>
      <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
        {truck.name}
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[truck.status]}`}>
          {truck.status.replace(/_/g, " ")}
        </span>
      </td>
      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 max-w-xs truncate">
        {truck.description || "—"}
      </td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={() => onDeleteClick(truck)}
          className="text-sm font-medium text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
        >
          Delete
        </button>
      </td>
    </tr>
  ));
};

export const TrucksList = ({ trucks = [], isLoading, isError }: TrucksListProps) => {
  const deleteTruck = useDeleteTruck();
  const [pendingTruck, setPendingTruck] = useState<Truck | null>(null);

  const handleConfirmDelete = () => {
    if (!pendingTruck) return;
    deleteTruck.mutate(pendingTruck.id, { onSettled: () => setPendingTruck(null) });
  };

  return (
    <>
      <section>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Fleet {!isLoading && `(${trucks.length})`}
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {isError ? (
            <div className="py-16 text-center text-red-500 dark:text-red-400 text-sm">
              Failed to load trucks. Please try again.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                    {COLUMNS.map((col) => (
                      <th
                        key={col}
                        className={`px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${col === "Actions" ? "text-right" : "text-left"}`}
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
