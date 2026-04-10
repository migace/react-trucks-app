import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { FleetPage } from "@/pages/FleetPage";
import { AddTruckPage } from "@/pages/AddTruckPage";
import { TruckDetailPage } from "@/pages/TruckDetailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <FleetPage /> },
      { path: "trucks/new", element: <AddTruckPage /> },
      { path: "trucks/:id", element: <TruckDetailPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
