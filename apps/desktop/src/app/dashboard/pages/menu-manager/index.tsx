import MenuManagerCards from "./components/MenuManagerCards";
import MenuManagerFilter from "./components/MenuManagerFilter";
import MenuManagerHeader from "./components/MenuManagerHeader";
import MenuManagerTable from "./components/MenuManagerTable";

function MenuManager() {
  return (
    <div className="space-y-4.5">
      <MenuManagerHeader />
      <MenuManagerCards />
      <MenuManagerFilter />
      <MenuManagerTable />
    </div>
  );
}

export default MenuManager;
