import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import SignIn from "@/features/auth/sign-in";
import BulkUploadMenuItems from "@/features/dashboard/bulk-upload-menu-items";
import DashboardLayout from "@/features/dashboard/components/dashboard-layout";
import FinancePage from "@/features/dashboard/finance-page";
import LiveOrders from "@/features/dashboard/live-orders";
import MenuManager from "@/features/dashboard/menu-manager";
import Overview from "@/features/dashboard/overview";
import Warehouse from "@/features/dashboard/warehouse";
import { useAuthStore } from "@/store/AuthStore";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import NotFound from "./not-found.page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: async () => {
      await useAuthStore.getState().authCheck();
      return null;
    },
    children: [{ index: true, element: <SignIn /> }],
  },
  {
    path: "/dashboard",
    loader: async () => {
      await useAuthStore.getState().authCheck();
      return null;
    },
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Overview /> },
          { path: "live-orders", element: <LiveOrders /> },
          { path: "menu-manager", element: <MenuManager /> },
          {
            path: "menu-manager/bulk-upload-menu-items",
            element: <BulkUploadMenuItems />,
          },
          { path: "warehouse", element: <Warehouse /> },
          { path: "finance-reports", element: <FinancePage /> },
          { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },
]);
