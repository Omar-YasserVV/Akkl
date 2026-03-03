import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import SignIn from "../auth/pages/SignIn";
import Home from "../home/Home";
import DashboardLayout from "../dashboard/components/dashboard-layout";
import Overview from "../dashboard/pages/overview";
import LiveOrders from "../dashboard/pages/live-orders";
import MenuManager from "../dashboard/pages/menu-manager";
import FinancePage from "../dashboard/pages/finance-page";
import Warehouse from "../dashboard/pages/warehouse";
import NotFound from "../dashboard/pages/not-found/not-found";
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
