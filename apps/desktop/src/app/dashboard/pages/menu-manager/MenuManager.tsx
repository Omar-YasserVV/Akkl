import MenuManagerCards from "./components/MenuManagerCards";
import MenuManagerFilter from "./components/MenuManagerFilter";
import MenuManagerHeader from "./components/MenuManagerHeader";
import MenuManagerTable from "./components/MenuManagerTable";

function MenuManager() {
  return (
    <div className="bg-[#F1F1F1] rounded-3xl mx-5">
      <MenuManagerHeader />
      <MenuManagerCards />
      <MenuManagerFilter />
      <MenuManagerTable />
    </div>
  );
}

export default MenuManager;
