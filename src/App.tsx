import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { FleetPage } from "@/pages/FleetPage";
import { AddTruckPage } from "@/pages/AddTruckPage";
import { TruckDetailPage } from "@/pages/TruckDetailPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

const AiPage = lazy(() =>
  import("@/pages/AiPage").then((m) => ({ default: m.AiPage })),
);

const AiPageWithSuspense = () => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center py-24 text-sm text-gray-400 dark:text-gray-500">
        Loading AI assistant...
      </div>
    }
  >
    <AiPage />
  </Suspense>
);

const router = createBrowserRouter([
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
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
