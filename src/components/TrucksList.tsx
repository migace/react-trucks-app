import { Truck, TruckStatus } from "../types/truck";

const STATUS_STYLES: Record<TruckStatus, string> = {
  OUT_OF_SERVICE: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  LOADING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  TO_JOB: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  AT_JOB: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  RETURNING: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

interface TrucksListProps {
  trucks: Truck[];
  onDelete: (truckId: string) => void;
}

export const TrucksList = ({ trucks = [], onDelete }: TrucksListProps) => (
  <section>
    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
      Fleet ({trucks.length})
    </h2>
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {trucks.length === 0 ? (
        <div className="py-16 text-center text-gray-400 dark:text-gray-500 text-sm">
          No trucks found. Add one above.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {trucks.map((truck) => (
                <tr
                  key={truck.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
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
                      onClick={() => onDelete(truck.id)}
                      className="text-sm font-medium text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </section>
);
