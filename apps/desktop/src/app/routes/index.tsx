import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import SignIn from "../auth/pages/SignIn";
import Home from "../home/Home";
import DashboardLayout from "../dashboard/components/dashboard-layout";
import Overview from "../dashboard/pages/overview";
import LiveOrders from "../dashboard/pages/live-orders/LiveOrders";

export const router = createBrowserRouter([
  {
    path: "/",
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
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Overview />,
      },
      {
        path: "live-orders",
        index: false,
        element: <LiveOrders />,
      }
    ],
  },
]);
