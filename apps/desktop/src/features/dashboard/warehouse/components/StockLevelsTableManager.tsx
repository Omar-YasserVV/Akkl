import StockLevelsTable from "./StockLevelsTable";

const StockLevelsTableManager = () => {
  const movementMock = [
    {
      itemName: "Organic Honey Crisp Apples",
      category: "Produce",
      currentStock: 450,
      unit: "kg",
      status: "IN_STOCK",
    },
    {
      itemName: "Whole Milk (1L)",
      category: "Dairy",
      currentStock: 1200,
      unit: "units",
      status: "LOW_STOCK",
    },
    {
      itemName: "Frozen Atlantic Salmon",
      category: "Seafood",
      currentStock: 85,
      unit: "cases",
      status: "IN_STOCK",
    },
    {
      itemName: "Boneless Chicken Breast",
      category: "Meat",
      currentStock: 12,
      unit: "cases",
      status: "CRITICAL_LOW",
    },
    {
      itemName: "All-Purpose Flour (25kg)",
      category: "Dry Goods",
      currentStock: 200,
      unit: "bags",
      status: "IN_STOCK",
    },
    {
      itemName: "Salted Butter Blocks",
      category: "Dairy",
      currentStock: 0,
      unit: "units",
      status: "OUT_OF_STOCK",
    },
  ];
  return <StockLevelsTable data={movementMock} />;
};

export default StockLevelsTableManager;
