import MenuManagerCards from "./components/MenuManagerCards";
import MenuManagerFilter from "./components/MenuManagerFilter";
import MenuManagerHeader from "./components/MenuManagerHeader";
import MenuManagerTable from "./components/MenuManagerTable";

function MenuManager() {
  return (
    <>
      <MenuManagerHeader />
      <MenuManagerCards />
      <MenuManagerFilter />
      <MenuManagerTable />
    </>
  );
}

export default MenuManager;
