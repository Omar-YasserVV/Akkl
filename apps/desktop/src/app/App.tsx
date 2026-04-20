import { AppBreadcrumb } from "@/shared/components/ui/AppBreadcrumb";
import { Outlet } from "react-router-dom";

function App() {
  // 
  return (
    <main>
      <AppBreadcrumb />
      <Outlet />
    </main>
  );
}

export default App;
