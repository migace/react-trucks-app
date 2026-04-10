import { useParams, Link } from "react-router-dom";
import { useTruck } from "@/hooks/trucks";
import { TruckStatus } from "@/types/truck";

const STATUS_STYLES: Record<TruckStatus, string> = {
  OUT_OF_SERVICE: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  LOADING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  TO_JOB: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  AT_JOB: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  RETURNING: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const DetailRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
    <span className="w-32 shrink-0 text-sm font-medium text-gray-500 dark:text-gray-400">
      {label}
    </span>
    <span className="text-sm text-gray-900 dark:text-gray-100">{children}</span>
  </div>
);

export const TruckDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: truck, isLoading, isError } = useTruck(id!);

  return (
    <div>
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Fleet
      </Link>

      {isLoading && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          {[...new Array(4)].map((_, i) => (
            <div key={i} className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: `${[40, 60, 30, 70][i]}%` }} />
          ))}
        </div>
      )}

      {isError && (
        <div className="py-16 text-center text-red-500 dark:text-red-400 text-sm">
          Truck not found or failed to load.
        </div>
      )}

      {!isLoading && !isError && truck && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {truck.name}
                </h2>
                <p className="text-sm font-mono text-gray-500 dark:text-gray-400 mt-0.5">
                  {truck.code}
                </p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[truck.status]}`}>
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
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[truck.status]}`}>
                {truck.status.replace(/_/g, " ")}
              </span>
            </DetailRow>
            <DetailRow label="Description">
              {truck.description || <span className="text-gray-400 italic">No description</span>}
            </DetailRow>
            <DetailRow label="ID">
              <span className="font-mono text-xs text-gray-400">{truck.id}</span>
            </DetailRow>
          </div>
        </div>
      )}
    </div>
  );
};
