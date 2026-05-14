import { Skeleton } from "@heroui/react";
import { parseMenuSummaryPayload } from "../api/menuItem";
import { MenuManagerCards_Metadata } from "../constants/MenuManagerCardsConst";
import { useMenuStats } from "../hooks/useMenuItem";
import MenuManagerCard from "./MenuManagerCard";

function MenuManagerCards() {
  const { data: menuStats, isPending } = useMenuStats();

  if (isPending) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {MenuManagerCards_Metadata.map((card) => (
          <Skeleton key={card.id} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const stats = menuStats ?? parseMenuSummaryPayload(null);

  return (
    <div className="grid grid-cols-4 gap-4">
      {MenuManagerCards_Metadata.map((card) => {
        const displayValue = stats[card.id];
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
