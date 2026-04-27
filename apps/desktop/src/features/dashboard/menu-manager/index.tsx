import { MenuFilters } from "@/types/Menu";
import { useState } from "react";
import MenuManagerCards from "./components/MenuManagerCards";
import MenuManagerFilter from "./components/MenuManagerFilter";
import MenuManagerHeader from "./components/MenuManagerHeader";
import MenuManagerTable from "./components/MenuManagerTable";

const initialFilters: MenuFilters = {
  page: 1,
  limit: 10,
};

function MenuManager() {
  const [filters, setFilters] = useState<MenuFilters>(initialFilters);

  const handleFilterChange = (nextFilters: Partial<MenuFilters>) =>
    setFilters((current) => ({ ...current, ...nextFilters }));

  return (
    <>
      <MenuManagerHeader />
      <MenuManagerCards />
      <MenuManagerFilter filters={filters} onChange={handleFilterChange} />
      <MenuManagerTable filters={filters} onChange={handleFilterChange} />
    </>
  );
}

export default MenuManager;
