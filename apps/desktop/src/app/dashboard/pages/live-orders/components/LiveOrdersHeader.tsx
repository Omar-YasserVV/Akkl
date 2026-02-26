import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
const LiveOrdersHeader = () => {
    return (
        <header className="flex justify-between items-end">
            <div>
                <h2 className="cherry-bomb-one-regular text-primary text-5xl">Live Orders</h2>
                <p className="text-muted-foreground">Manage orders from app and restaurant in real-time.</p>
            </div>
            <Button className="bg-primary rounded-lg px-3 text-white py-3"><Plus />New Order</Button>
        </header>
    )
}

export default LiveOrdersHeader