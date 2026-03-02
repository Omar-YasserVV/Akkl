interface MenuManagerCardProps {
  title: string;
  value: number;
}

function MenuManagerCard({ title, value }: MenuManagerCardProps) {
  return (
    <div className="bg-white rounded-2xl px-5 py-4 shadow-xs">
      <h3 className="text-[13.7px] text-[#808080]">{title}</h3>
      <p className="font-bold text-2xl">{value}</p>
    </div>
  );
}

export default MenuManagerCard;
