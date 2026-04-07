import SignIn from "@/features/auth/sign-in";
import BulkUploadMenuItems from "@/features/dashboard/bulk-upload-menu-items";
import DashboardLayout from "@/features/dashboard/components/dashboard-layout";
import FinancePage from "@/features/dashboard/finance-page";
import LiveOrders from "@/features/dashboard/live-orders";
import MenuManager from "@/features/dashboard/menu-manager";
import Overview from "@/features/dashboard/overview";
import Warehouse from "@/features/dashboard/warehouse";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import NotFound from "./not-found.page";
export const router = createBrowserRouter([
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/",
    errorElement: <NotFound />,
    element: <App />, // The Layout
    children: [
      {
        index: true, // This makes Home the default for "/"
        element: <SignIn />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "/dashboard",
    errorElement: <NotFound />,
    element: <DashboardLayout />,
    children: [
      {
        path: "*",
        element: <NotFound />,
      },
      {
        index: true,
        element: <Overview />,
      },
      {
        path: "live-orders",
        index: false,
        element: <LiveOrders />,
      },
      {
        path: "menu-manager",
        index: false,
        element: <MenuManager />,
      },
      {
        path: "menu-manager/bulk-upload-menu-items",
        index: false,
        element: <BulkUploadMenuItems />,
      },
      {
        path: "warehouse",
        index: false,
        element: <Warehouse />,
      },
      {
        path: "finance-reports",
        index: false,
        element: <FinancePage />,
      },
    ],
  },
]);
