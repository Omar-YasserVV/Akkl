export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="relative mb-4 flex flex-col items-center">
        {/* The Bubble */}
        <div className="bg-[#1a73e8] text-white p-4 rounded-2xl shadow-lg min-w-[140px] text-center">
          <p className="text-xs font-medium opacity-90 mb-1">{label} 2025</p>
          <p className="text-3xl font-bold">${payload[0].value}</p>
        </div>
      </div>
    );
  }
  return null;
};
