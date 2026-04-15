import { Link } from "react-router-dom";

export const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center gap-4 py-24">
    <h2 className="text-6xl font-bold text-gray-300 dark:text-gray-700">404</h2>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      The page you&apos;re looking for doesn&apos;t exist.
    </p>
    <Link
      to="/"
      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
    >
      Back to Fleet
    </Link>
  </div>
);
