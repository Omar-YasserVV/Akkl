interface MenuManagerCardProps {
  title: string;
  value: number | string;
}

function formatCardStat(value: number | string): string {
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "—";
  }
  return value;
}

function MenuManagerCard({ title, value }: MenuManagerCardProps) {
  return (
    <div className="bg-white rounded-2xl px-5 py-4 shadow-xs">
      <h3 className="text-[13.7px] text-slate-500">{title}</h3>
      <p className="font-bold text-2xl">{formatCardStat(value)}</p>
    </div>
  );
}

export default MenuManagerCard;
