import { useState } from "react";
import { Button } from "@heroui/react";

const MenuManagerFilter = () => {
  // Local state to track selections - in a real app,
  // you'd likely pass these as props or use a global store
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeAvailability, setActiveAvailability] = useState("All");

  const categories = ["All", "Main", "Sides", "Drinks", "Desserts"];
  const availabilityOptions = ["All", "Available", "Unavailable"];

  // Helper to determine button styling based on active state
  const getBtnClasses = (isActive: boolean) =>
    `min-w-[20px] h-9 px-4 text-[13.7px] rounded-sm font-medium transition-all ${
      isActive
        ? "bg-primary text-white shadow-md"
        : "bg-[#F4F4F5] text-[#18181B] hover:bg-[#E4E4E7]"
    }`;

  return (
    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
      {/* Category Filter */}
      <div className="flex items-center gap-2">
        <span className="text-[13.7px] font-medium text-[#18181B]">
          Category:
        </span>
        <div className="flex gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              onPress={() => setActiveCategory(cat)}
              className={getBtnClasses(activeCategory === cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div className="flex items-center gap-4">
        <span className="text-[13.7px] font-medium text-[#18181B]">
          Availability:
        </span>
        <div className="flex gap-2">
          {availabilityOptions.map((opt) => (
            <Button
              key={opt}
              onPress={() => setActiveAvailability(opt)}
              className={getBtnClasses(activeAvailability === opt)}
            >
              {opt}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuManagerFilter;
