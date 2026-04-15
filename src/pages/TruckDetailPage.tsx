import { useParams, Link, Navigate } from "react-router-dom";
import { useTruck } from "@/hooks/trucks";
import { cn } from "@/lib/cn";
import { STATUS_STYLES } from "@/lib/truckStatus";

const DetailRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1 border-b border-gray-100 py-4 last:border-0 sm:flex-row sm:items-start sm:gap-4 dark:border-gray-700">
    <span className="w-32 shrink-0 text-sm font-medium text-gray-500 dark:text-gray-400">
      {label}
    </span>
    <span className="text-sm text-gray-900 dark:text-gray-100">{children}</span>
  </div>
);

export const TruckDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) return <Navigate to="/" replace />;

  return <TruckDetail id={id} />;
};

const TruckDetail = ({ id }: { id: string }) => {
  const { data: truck, isLoading, isError } = useTruck(id);

  return (
    <div>
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Fleet
      </Link>

      {isLoading && (
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          {[40, 60, 30, 70].map((width, i) => (
            <div
              key={i}
              className="h-5 animate-pulse rounded bg-gray-200 dark:bg-gray-700"
              style={{ width: `${width}%` }}
            />
          ))}
        </div>
      )}

      {isError && (
        <div className="py-16 text-center text-sm text-red-500 dark:text-red-400">
          Truck not found or failed to load.
        </div>
      )}

      {!isLoading && !isError && truck && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-100 px-6 py-5 dark:border-gray-700">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {truck.name}
                </h2>
                <p className="mt-0.5 font-mono text-sm text-gray-500 dark:text-gray-400">
                  {truck.code}
                </p>
              </div>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                  STATUS_STYLES[truck.status],
                )}
              >
                {truck.status.replace(/_/g, " ")}
              </span>
            </div>
          </div>

          <div className="px-6">
            <DetailRow label="Code">
              <span className="font-mono">{truck.code}</span>
            </DetailRow>
            <DetailRow label="Name">{truck.name}</DetailRow>
            <DetailRow label="Status">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                  STATUS_STYLES[truck.status],
                )}
              >
                {truck.status.replace(/_/g, " ")}
              </span>
            </DetailRow>
            <DetailRow label="Description">
              {truck.description || (
                <span className="text-gray-400 italic">No description</span>
              )}
            </DetailRow>
            <DetailRow label="ID">
              <span className="font-mono text-xs text-gray-400">
                {truck.id}
              </span>
            </DetailRow>
          </div>
        </div>
      )}
    </div>
  );
};
