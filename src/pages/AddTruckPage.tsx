import { useNavigate, Link } from "react-router-dom";
import { AddTruck } from "@/components/AddTruck";

export const AddTruckPage = () => {
  const navigate = useNavigate();

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

      <AddTruck onSuccess={() => navigate("/")} />
    </div>
  );
};
