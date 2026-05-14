import { Skeleton } from "@heroui/react";
import { MenuManagerCards_Metadata } from "../constants/MenuManagerCardsConst";
import { useMenuStats } from "../hooks/useMenuItem";
import MenuManagerCard from "./MenuManagerCard";

function MenuManagerCards() {
  const { data: menuStats, isLoading } = useMenuStats();

  return (
    <div className="grid grid-cols-4 gap-4">
      {isLoading || !menuStats
        ? MenuManagerCards_Metadata.map((card) => (
            <Skeleton key={card.id} className="h-24 w-full rounded-xl" />
          ))
        : MenuManagerCards_Metadata.map((card) => {
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
