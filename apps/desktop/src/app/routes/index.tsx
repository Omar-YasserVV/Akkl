import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import SignIn from "../pages/auth/sign-in/SignIn";
import Home from "../pages/home/Home";

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
]);
