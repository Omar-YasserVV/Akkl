import { MenuManagerCards_Constants } from "../constants/MenuManagerCardsConst";
import MenuManagerCard from "./MenuManagerCard";

function MenuManagerCards() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {MenuManagerCards_Constants.map((card) => {
        return <MenuManagerCard title={card.title} value={card.value} />;
      })}
    </div>
  );
}

export default MenuManagerCards;
