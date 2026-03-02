import { Outlet } from "react-router-dom";
import { AppBreadcrumb } from "./components/ui/AppBreadcrumb";

function App() {
  return (
    <main>
      <AppBreadcrumb />
      <Outlet />
    </main>
  );
}

export default App;
