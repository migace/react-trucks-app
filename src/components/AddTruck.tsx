import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { truckSchema, TruckFormData, TRUCK_STATUSES } from "@/schemas/truck";
import { useAddTruck } from "@/hooks/trucks";
import { STATUS_LABELS } from "@/lib/truckStatus";

const fieldClass =
  "w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

const labelClass =
  "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

const errorClass = "mt-1 text-xs text-red-500 dark:text-red-400";

interface AddTruckProps {
  onSuccess?: () => void;
}

export const AddTruck = ({ onSuccess }: AddTruckProps) => {
  const addTruck = useAddTruck();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TruckFormData>({
    resolver: zodResolver(truckSchema),
    defaultValues: {
      status: "OUT_OF_SERVICE",
      description: "",
    },
  });

  const onSubmit = (data: TruckFormData) => {
    addTruck.mutate(data, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
    });
  };

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
        Add New Truck
      </h2>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <div>
            <label htmlFor="code" className={labelClass}>
              Code
            </label>
            <input
              id="code"
              placeholder="e.g. TRK-001"
              className={fieldClass}
              {...register("code")}
            />
            {errors.code && <p className={errorClass}>{errors.code.message}</p>}
          </div>

          <div>
            <label htmlFor="name" className={labelClass}>
              Name
            </label>
            <input
              id="name"
              placeholder="e.g. Volvo FH16"
              className={fieldClass}
              {...register("name")}
            />
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="status" className={labelClass}>
              Status
            </label>
            <select id="status" className={fieldClass} {...register("status")}>
              {TRUCK_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className={errorClass}>{errors.status.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="Optional notes..."
              className={fieldClass}
              {...register("description")}
            />
            {errors.description && (
              <p className={errorClass}>{errors.description.message}</p>
            )}
          </div>

          <div className="flex justify-end pt-2 sm:col-span-2">
            <button
              type="submit"
              disabled={addTruck.isPending}
              className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {addTruck.isPending ? "Adding..." : "Add Truck"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
