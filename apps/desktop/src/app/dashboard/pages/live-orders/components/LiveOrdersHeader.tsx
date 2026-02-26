import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Textarea,
  Select,
  SelectItem,
} from "@heroui/react";
import { BiPlus, BiX } from "react-icons/bi";

const LiveOrdersHeader = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const uploadId = React.useId();
  const [selectedFilesLabel, setSelectedFilesLabel] =
    React.useState<string>("Upload file");

  return (
    <header className="flex justify-between items-end">
      <div>
        <h2 className="font-cherry text-primary text-5xl">Live Orders</h2>
        <p className="text-muted-foreground">
          Manage orders from app and restaurant in real-time.
        </p>
      </div>
      <Button
        onPress={onOpen}
        className="bg-primary rounded-lg px-3 text-white py-3"
      >
        <BiPlus />
        New Order
      </Button>
      <Modal
        isOpen={isOpen}
        placement="top-center"
        onOpenChange={onOpenChange}
        size="lg"
        hideCloseButton
      >
        <ModalContent className="rounded-lg">
          {(onClose: () => void) => (
            <>
              <ModalHeader className="flex items-center justify-between pb-2 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Create New Order
                </h3>
                <button
                  type="button"
                  aria-label="Close"
                  className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
                  onClick={onClose}
                >
                  <BiX className="h-4 w-4" />
                </button>
              </ModalHeader>
              <ModalBody className="py-4 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Order Number *"
                    placeholder="#ORD001"
                    variant="bordered"
                    radius="sm"
                    labelPlacement="outside"
                    classNames={{
                      label: "text-xs font-medium text-gray-700 mb-1",
                    }}
                  />
                  <Input
                    label="Customer Name *"
                    placeholder="John Doe"
                    variant="bordered"
                    radius="sm"
                    labelPlacement="outside"
                    classNames={{
                      label: "text-xs font-medium text-gray-700 mb-1",
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Source *"
                    placeholder="Mobile App"
                    variant="bordered"
                    radius="sm"
                    selectedKeys={["mobile"]}
                    labelPlacement="outside"
                    classNames={{
                      label: "text-xs font-medium text-gray-700 mb-1",
                      trigger: "h-11",
                    }}
                  >
                    <SelectItem key="mobile">Mobile App</SelectItem>
                    <SelectItem key="restaurant">Restaurant</SelectItem>
                  </Select>
                  <Select
                    label="Status *"
                    placeholder="Pending"
                    variant="bordered"
                    radius="sm"
                    selectedKeys={["pending"]}
                    labelPlacement="outside"
                    classNames={{
                      label: "text-xs font-medium text-gray-700 mb-1",
                      trigger: "h-11",
                    }}
                  >
                    <SelectItem key="pending">Pending</SelectItem>
                    <SelectItem key="cooking">Cooking</SelectItem>
                    <SelectItem key="ready">Ready</SelectItem>
                  </Select>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
                  <div className="bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-800">
                    Item #1
                  </div>
                  <div className="px-4 py-4 space-y-4 bg-white">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-gray-900">
                        Order Items
                      </p>
                      <div className="grid grid-cols-[minmax(0,2fr)_80px_96px] gap-3">
                        <Input
                          placeholder="Select Item"
                          radius="sm"
                          variant="bordered"
                        />
                        <Input
                          type="number"
                          placeholder="1"
                          radius="sm"
                          variant="bordered"
                        />
                        <Button
                          color="primary"
                          radius="sm"
                          className="text-xs font-semibold"
                        >
                          <BiPlus size={"18"} /> Add
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-gray-900">
                        Special Notes
                      </p>
                      <Textarea
                        placeholder="Any special instructions..."
                        radius="sm"
                        variant="bordered"
                        minRows={2}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-1">
                  <input
                    id={uploadId}
                    type="file"
                    className="sr-only"
                    onChange={(e) => {
                      const files = e.currentTarget.files;
                      if (!files || files.length === 0) {
                        setSelectedFilesLabel("Add another Item");
                        return;
                      }
                      if (files.length === 1) {
                        setSelectedFilesLabel(
                          files[0]?.name ?? "1 file selected",
                        );
                        return;
                      }
                      setSelectedFilesLabel(`${files.length} files selected`);
                    }}
                  />
                  <label
                    htmlFor={uploadId}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-3 text-sm font-medium text-gray-500 hover:bg-gray-100"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white">
                      <BiPlus className="h-3 w-3" />
                    </span>
                    {selectedFilesLabel}
                  </label>
                </div>
              </ModalBody>
              <ModalFooter className="pt-2">
                <Button
                  variant="flat"
                  radius="sm"
                  className="bg-white"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button color="primary" radius="sm" onPress={onClose}>
                  Create Order
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </header>
  );
};

export default LiveOrdersHeader;
