import { FormEvent } from "react";
import { TruckStatus } from "../types/truck";

const TRUCK_STATUSES: TruckStatus[] = [
  "OUT_OF_SERVICE",
  "LOADING",
  "TO_JOB",
  "AT_JOB",
  "RETURNING",
];

const fieldClass =
  "w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

interface AddTruckProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export const AddTruck = ({ onSubmit }: AddTruckProps) => (
  <section>
    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
      Add New Truck
    </h2>
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="code" className={labelClass}>Code</label>
          <input
            id="code"
            name="code"
            placeholder="e.g. TRK-001"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="name" className={labelClass}>Name</label>
          <input
            id="name"
            name="name"
            placeholder="e.g. Volvo FH16"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="status" className={labelClass}>Status</label>
          <select id="status" name="status" className={fieldClass}>
            {TRUCK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>Description</label>
          <textarea
            rows={3}
            id="description"
            name="description"
            placeholder="Optional notes..."
            className={fieldClass}
          />
        </div>

        <div className="sm:col-span-2 flex justify-end pt-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium px-6 py-2 rounded-lg transition-colors shadow-sm"
          >
            Add Truck
          </button>
        </div>
      </form>
    </div>
  </section>
);
