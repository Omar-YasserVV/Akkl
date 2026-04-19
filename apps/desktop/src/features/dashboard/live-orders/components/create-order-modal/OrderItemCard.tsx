import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { BiPlus, BiTrash } from "react-icons/bi";
import { BranchMenuItem } from "../../types/LiveOrders.types";
import { DraftItem } from "../../types/OrderList.types";

type OrderItemCardProps = {
  item: DraftItem;
  index: number;
  canRemove: boolean;
  menuItems: BranchMenuItem[];
  isLoadingMenuItems: boolean;
  onRemove: (id: string) => void;
  onItemChange: <K extends keyof DraftItem>(
    id: string,
    field: K,
    value: DraftItem[K],
  ) => void;
};

const OrderItemCard = ({
  item,
  index,
  canRemove,
  menuItems,
  isLoadingMenuItems,
  onRemove,
  onItemChange,
}: OrderItemCardProps) => {
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-default-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <span className="font-bold text-gray-700">Item #{index + 1}</span>
        {canRemove && (
          <button
            onClick={() => onRemove(item.id)}
            className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
          >
            <BiTrash size={18} />
          </button>
        )}
      </div>

      <div className="p-5 space-y-5">
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700">Order Items</label>
          <div className="grid grid-cols-[1fr_100px_100px] gap-3">
            <Select
              placeholder="Select Item"
              isLoading={isLoadingMenuItems}
              selectedKeys={item.menuItemId ? [item.menuItemId] : []}
              onSelectionChange={(keys) =>
                onItemChange(
                  item.id,
                  "menuItemId",
                  Array.from(keys)[0] as string,
                )
              }
              classNames={{
                trigger: "bg-white border border-gray-200 h-12 shadow-none",
              }}
            >
              {menuItems.map((menuItem) => (
                <SelectItem key={menuItem.id}>{menuItem.name}</SelectItem>
              ))}
            </Select>

            <Input
              type="number"
              min={1}
              value={item.quantity.toString()}
              onValueChange={(value) =>
                onItemChange(item.id, "quantity", parseInt(value, 10) || 1)
              }
              classNames={{
                inputWrapper:
                  "bg-white border border-gray-200 h-12 shadow-none",
                input: "text-center",
              }}
            />

            <Button
              color="primary"
              className="h-12 font-bold bg-[#1a73e8] "
              startContent={<BiPlus size={20} />}
              onPress={() =>
                onItemChange(item.id, "quantity", item.quantity + 1)
              }
            >
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700">
            Special Notes
          </label>
          <Textarea
            placeholder="Any special instructions..."
            value={item.specialNotes}
            onValueChange={(value) =>
              onItemChange(item.id, "specialNotes", value)
            }
            classNames={{
              inputWrapper: "bg-white border border-gray-200 shadow-none",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderItemCard;
