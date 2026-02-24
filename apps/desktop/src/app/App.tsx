import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import SignIn from "./pages/auth/SignIn";
import { AppBreadcrumb } from "./components/ui/AppBreadcrumb";

function App() {
  return (
    <HashRouter>
      <AppBreadcrumb />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
