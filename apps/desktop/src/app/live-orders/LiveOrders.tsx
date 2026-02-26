import { Button } from "@heroui/react";

const LiveOrders = () => {
    return (
        <div className="px-4 py-6 flex flex-col gap-4 bg-[#F1F1F1] rounded-lg">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="cherry-bomb-one-regular text-primary text-5xl">Live Orders</h2>
                    <p className="text-muted-foreground">Manage orders from app and restaurant in real-time.</p>
                </div>
                <Button className="bg-primary font-semibold rounded-lg px-3 text-white py-3">+ New Order</Button>
            </div>
        </div>
    )
}

export default LiveOrders