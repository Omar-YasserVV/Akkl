import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import MenuManager from "@/features/dashboard/menu-manager";
import FinancePage from "@/features/dashboard/finance-page";
import Warehouse from "@/features/dashboard/warehouse";
import NotFound from "./not-found.page";
import Home from "@/features/home";
import SignIn from "@/features/auth/sign-in";
import DashboardLayout from "@/features/dashboard/components/dashboard-layout";
import Overview from "@/features/dashboard/overview";
import LiveOrders from "@/features/dashboard/live-orders";
import BulkUploadMenuItems from "@/features/dashboard/menu-manager/components/bulk-upload-menu-items";
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
        element: <Home />,
      },
      {
        path: "sign-in",
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
