import { MenuManagerCards_Metadata } from "../constants/MenuManagerCardsConst";
import { useMenuStats } from "../hooks/useMenuItem";
import MenuManagerCard from "./MenuManagerCard";

function MenuManagerCards() {
  const { data: menuStats, isLoading } = useMenuStats();

  if (isLoading || !menuStats) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-4 gap-4">
      {MenuManagerCards_Metadata.map((card) => {
        // TypeScript now understands that menuStats[card.id] is safe
        const displayValue = menuStats[card.id];

        return (
          <MenuManagerCard
            key={card.id}
            title={card.title}
            value={displayValue}
          />
        );
      })}
    </div>
  );
}
export default MenuManagerCards;
