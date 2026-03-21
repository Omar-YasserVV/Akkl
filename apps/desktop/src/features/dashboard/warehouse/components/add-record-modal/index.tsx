import {
  Modal,
  ModalBody,
  ModalContent,
  DateInput,
  TimeInput,
  Textarea,
} from "@heroui/react";
import { FormProvider, Controller } from "react-hook-form";
import { BiX } from "react-icons/bi";

import RecordModalHeader from "./RecordModalHeader";
import RecordModalFooter from "./RecordModalFooter";
import { ControlledAutocomplete } from "@/features/dashboard/components/shared/ControlledAutocomplete";
import { ControlledInput } from "@/features/dashboard/components/shared/ControlledInput";
import { StockComparison } from "./StockComparison";
import { CalendarDate, Time } from "@internationalized/date";
import { useAddRecordForm } from "../../hooks/useAddRecordForm";

export interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddRecordModal = ({ isOpen, onClose }: AddRecordModalProps) => {
  const methods = useAddRecordForm();

  const handleClose = () => {
    onClose();
    methods.reset();
  };

  /**
   * Mock form submit handler for testing purposes only.
   * Logs the submitted data, simulates a 2-second async operation,
   * and then closes the modal and resets the form.
   * TODO: Replace with actual API submission logic.
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    methods.handleSubmit(
      async (data) => {
        console.log("Form Submitted:", data);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        handleClose();
      },
      (errors) => console.error("Form Errors:", errors),
    )();
  };

  const animals = [
    {
      label: "Cat",
      key: "cat",
      description: "The second most popular pet in the world",
    },

    {
      label: "Dog",
      key: "dog",
      description: "The most popular pet in the world",
    },
    {
      label: "Elephant",
      key: "elephant",
      description: "The largest land animal",
    },
    { label: "Lion", key: "lion", description: "The king of the jungle" },
    { label: "Tiger", key: "tiger", description: "The largest cat species" },
    {
      label: "Giraffe",
      key: "giraffe",
      description: "The tallest land animal",
    },
    {
      label: "Dolphin",
      key: "dolphin",
      description: "A widely distributed and diverse group of aquatic mammals",
    },
    {
      label: "Penguin",
      key: "penguin",
      description: "A group of aquatic flightless birds",
    },
    {
      label: "Zebra",
      key: "zebra",
      description: "A several species of African equids",
    },
    {
      label: "Shark",
      key: "shark",
      description:
        "A group of elasmobranch fish characterized by a cartilaginous skeleton",
    },
    {
      label: "Whale",
      key: "whale",
      description: "Diverse group of fully aquatic placental marine mammals",
    },
    {
      label: "Otter",
      key: "otter",
      description: "A carnivorous mammal in the subfamily Lutrinae",
    },
    {
      label: "Crocodile",
      key: "crocodile",
      description: "A large semiaquatic reptile",
    },
  ];
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      onClose={handleClose}
      size="3xl"
      scrollBehavior="inside"
      closeButton={<BiX className="text-2xl" />}
      classNames={{
        base: "rounded-[20px]",
        header: "border-b py-4",
        footer: "border-t py-4 bg-white",
      }}
    >
      <ModalContent>
        {(internalClose) => (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit}>
              <RecordModalHeader onClose={internalClose} />

              <ModalBody className="py-6 px-8 bg-default-50 grid grid-cols-2 gap-x-4 gap-y-6">
                <ControlledAutocomplete
                  name="ingredientId"
                  label="Select Item"
                  placeholder="Search for an ingredient..."
                  items={animals}
                  className="col-span-2"
                />

                <ControlledInput
                  name="quantity"
                  label="Quantity"
                  type="number"
                  placeholder="0.00"
                  className="col-span-1"
                />

                <ControlledAutocomplete
                  name="unit"
                  label="Select Unit"
                  placeholder="Search for a unit..."
                  items={animals}
                  className="col-span-1"
                />

                <div className="flex gap-4 col-span-1">
                  <Controller
                    name="recordedAt.date"
                    control={methods.control}
                    render={({ field, fieldState: { error } }) => (
                      <DateInput
                        {...field}
                        value={
                          field.value
                            ? new CalendarDate(
                                field.value.year,
                                field.value.month,
                                field.value.day,
                              )
                            : null
                        }
                        label="Date"
                        labelPlacement="outside"
                        radius="sm"
                        variant="bordered"
                        isInvalid={!!error}
                        errorMessage={error?.message}
                      />
                    )}
                  />
                  <Controller
                    name="recordedAt.time"
                    control={methods.control}
                    render={({ field, fieldState: { error } }) => (
                      <TimeInput
                        {...field}
                        value={
                          field.value
                            ? new Time(field.value.hour, field.value.minute)
                            : null
                        }
                        label="Time"
                        labelPlacement="outside"
                        radius="sm"
                        variant="bordered"
                        isInvalid={!!error}
                        errorMessage={error?.message}
                      />
                    )}
                  />
                </div>

                <ControlledAutocomplete
                  name="reason"
                  label="Reason for Usage"
                  placeholder="Search for a reason..."
                  items={[
                    { label: "Kitchen Prep", key: "Kitchen Prep" },
                    { label: "Internal Transfer", key: "Internal Transfer" },
                    { label: "Damaged", key: "Damaged" },
                    { label: "Expired", key: "Expired" },
                    { label: "Sample/Testing", key: "Sample/Testing" },
                    {
                      label: "Discrepancy Correction",
                      key: "Discrepancy Correction",
                    },
                  ]}
                  className="col-span-1"
                />

                <Controller
                  name="notes"
                  control={methods.control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      label="Notes (Optional)"
                      placeholder="Add specific details..."
                      className="col-span-2"
                      radius="sm"
                      variant="bordered"
                      labelPlacement="outside"
                    />
                  )}
                />

                <StockComparison
                  currentStock={45.5}
                  projectedStock={40.0}
                  unit="kg"
                />
              </ModalBody>

              <RecordModalFooter onClose={internalClose} />
            </form>
          </FormProvider>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddRecordModal;
