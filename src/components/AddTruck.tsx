import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { truckSchema, TruckFormData, TRUCK_STATUSES } from "@/schemas/truck";
import { useAddTruck } from "@/hooks/trucks";

const fieldClass =
  "w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

const errorClass = "mt-1 text-xs text-red-500 dark:text-red-400";

export const AddTruck = () => {
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
    addTruck.mutate(data, { onSuccess: () => reset() });
  };

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Add New Truck
      </h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div>
            <label htmlFor="code" className={labelClass}>Code</label>
            <input
              id="code"
              placeholder="e.g. TRK-001"
              className={fieldClass}
              {...register("code")}
            />
            {errors.code && <p className={errorClass}>{errors.code.message}</p>}
          </div>

          <div>
            <label htmlFor="name" className={labelClass}>Name</label>
            <input
              id="name"
              placeholder="e.g. Volvo FH16"
              className={fieldClass}
              {...register("name")}
            />
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="status" className={labelClass}>Status</label>
            <select id="status" className={fieldClass} {...register("status")}>
              {TRUCK_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, " ")}
                </option>
              ))}
            </select>
            {errors.status && <p className={errorClass}>{errors.status.message}</p>}
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>Description</label>
            <textarea
              id="description"
              rows={3}
              placeholder="Optional notes..."
              className={fieldClass}
              {...register("description")}
            />
            {errors.description && <p className={errorClass}>{errors.description.message}</p>}
          </div>

          <div className="sm:col-span-2 flex justify-end pt-2">
            <button
              type="submit"
              disabled={addTruck.isPending}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-2 rounded-lg transition-colors shadow-sm"
            >
              {addTruck.isPending ? "Adding..." : "Add Truck"}
            </button>
          </div>

        </form>
      </div>
    </section>
  );
};
