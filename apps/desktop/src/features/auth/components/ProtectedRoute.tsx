import { useAuthStore } from "@/store/AuthStore";
import { Spinner } from "@heroui/react";
import { Navigate, Outlet, useNavigation } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();
  void isAuthenticated;
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  if (isLoading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};
export default ProtectedRoute;
