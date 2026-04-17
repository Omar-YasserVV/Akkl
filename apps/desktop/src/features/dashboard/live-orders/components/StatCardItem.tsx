import { Card } from "@heroui/react"
import { StatCardItemProps } from "../types/StatsCard.types"

function StatCardItem({ 
  label, 
  value, 
  icon: Icon, 
  borderColor, 
  bgColor, 
  iconColor 
}: StatCardItemProps) {
  return (
 <Card className={`flex flex-row items-center justify-between border-2 rounded-lg p-4 bg-white ${borderColor} w-full`}>
    <div className="flex flex-col gap-2 items-start">
      <p className="text-gray-500 text-sm font-normal">{label}</p>
      <p className="text-2xl font-bold text-black">{value}</p>
    </div>
    <div className={`${bgColor} rounded-md p-3 flex items-center justify-center`}>
      <Icon className={`w-6 h-6 ${iconColor}`} />
    </div>
  </Card>  )
}

export default StatCardItem