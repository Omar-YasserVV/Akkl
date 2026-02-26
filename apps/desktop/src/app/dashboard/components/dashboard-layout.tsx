import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Topbar from "./topbar";
import { AppBreadcrumb } from "@/app/components/ui/AppBreadcrumb";

const DashboardLayout = () => {
  return (
    <>
      <AppBreadcrumb />

      <div className="flex h-screen w-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <div className="flex-1 overflow-auto px-4.5 py-6 bg-[#F1F1F1] rounded-lg mr-4.5 mb-4.5">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
