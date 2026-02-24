import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import { AppBreadcrumb } from "./components/ui/AppBreadcrumb";

function App() {
  return (
    <HashRouter>
      <AppBreadcrumb />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
