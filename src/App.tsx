import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { FleetPage } from "@/pages/FleetPage";
import { AddTruckPage } from "@/pages/AddTruckPage";
import { TruckDetailPage } from "@/pages/TruckDetailPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

const AiPage = lazy(() =>
  import("@/pages/AiPage").then((m) => ({ default: m.AiPage })),
);

const AiPageWithSuspense = () => (
  <ErrorBoundary
    fallback={
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          AI Assistant Error
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Something went wrong loading the AI assistant. Please refresh the
          page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Refresh page
        </button>
      </div>
    }
  >
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24 text-sm text-gray-400 dark:text-gray-500">
          Loading AI assistant...
        </div>
      }
    >
      <AiPage />
    </Suspense>
  </ErrorBoundary>
);

const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <FleetPage /> },
        { path: "trucks/new", element: <AddTruckPage /> },
        { path: "trucks/:id", element: <TruckDetailPage /> },
        { path: "ai", element: <AiPageWithSuspense /> },
        { path: "*", element: <NotFoundPage /> },
      ],
    },
  ],
  { basename },
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
