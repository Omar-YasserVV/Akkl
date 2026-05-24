import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useState } from "react";
import { BsPlusCircle } from "react-icons/bs";
import { LuCalendarDays, LuMinus, LuPlus, LuUser } from "react-icons/lu";
import { useSettingsStore } from "../../settings/store/useSettingsStore";
import { useReservationStore } from "../store/useReservationStore";
import type { ReservationStatus } from "../types/reservation.types";

type NewReservationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultAreaId?: string;
};

const NewReservationModal = ({ isOpen, onClose, defaultAreaId }: NewReservationModalProps) => {
  const zones = useSettingsStore((state) => state.data.floorPlan.zones);
  const addReservation = useReservationStore((state) => state.addReservation);

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  
  const [date, setDate] = useState("");
  const [guestsCount, setGuestsCount] = useState(2);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedArea, setSelectedArea] = useState(defaultAreaId || "");

  const availableTimes = ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"];

  const handleConfirm = () => {
    if (!fullName || !phoneNumber || !date || !selectedTime || !selectedArea) return;

    addReservation({
      id: `res-${Date.now()}`,
      guest: {
        fullName,
        phoneNumber,
        emailAddress,
        specialRequests,
      },
      date,
      time: selectedTime,
      guestsCount,
      areaId: selectedArea,
      status: "Confirmed" as ReservationStatus,
      createdAt: new Date().toISOString(),
    });

    onClose();
    // Reset state
    setFullName("");
    setPhoneNumber("");
    setEmailAddress("");
    setSpecialRequests("");
    setDate("");
    setGuestsCount(2);
    setSelectedTime("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" classNames={{ base: "bg-white" }}>
      <ModalContent>
        <ModalHeader className="flex items-start gap-3 border-b border-slate-100 pb-4 pt-6">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-primary">
            <BsPlusCircle size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">New Reservation</h2>
            <p className="text-sm font-normal text-slate-500">
              Create a new booking for your restaurant
            </p>
          </div>
        </ModalHeader>
        <ModalBody className="p-6">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Guest Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold tracking-wider text-slate-900 uppercase">
                <LuUser className="text-primary" size={16} />
                Guest Details
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Full Name
                </label>
                <Input
                  placeholder="e.g. Michael Chen"
                  variant="faded"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  classNames={{ inputWrapper: "bg-slate-50 border-slate-200 shadow-none" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Phone Number
                  </label>
                  <Input
                    placeholder="+1 (555) 000-0000"
                    variant="faded"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    classNames={{ inputWrapper: "bg-slate-50 border-slate-200 shadow-none" }}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Email Address
                  </label>
                  <Input
                    placeholder="m.chen@example.com"
                    variant="faded"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    classNames={{ inputWrapper: "bg-slate-50 border-slate-200 shadow-none" }}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Special Requests / Notes
                </label>
                <Textarea
                  placeholder="Allergies, anniversary, high chair needed..."
                  variant="faded"
                  minRows={3}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  classNames={{ inputWrapper: "bg-slate-50 border-slate-200 shadow-none" }}
                />
              </div>
            </div>

            {/* Reservation Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold tracking-wider text-slate-900 uppercase">
                <LuCalendarDays className="text-primary" size={16} />
                Reservation Info
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Date
                  </label>
                  <Input
                    type="date"
                    variant="faded"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    classNames={{ inputWrapper: "bg-slate-50 border-slate-200 shadow-none" }}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Guests
                  </label>
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-1">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => setGuestsCount((p) => Math.max(1, p - 1))}
                    >
                      <LuMinus />
                    </Button>
                    <span className="font-bold text-slate-900">{guestsCount}</span>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => setGuestsCount((p) => p + 1)}
                    >
                      <LuPlus />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Available Times
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {availableTimes.map((time) => (
                    <Button
                      key={time}
                      size="sm"
                      variant={selectedTime === time ? "solid" : "bordered"}
                      color={selectedTime === time ? "primary" : "default"}
                      className={`font-semibold ${
                        selectedTime !== time ? "border-slate-200 bg-white" : ""
                      }`}
                      onPress={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Seating Area
                </label>
                <Select
                  placeholder="Select an area"
                  variant="faded"
                  selectedKeys={selectedArea ? [selectedArea] : []}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  classNames={{ trigger: "bg-slate-50 border-slate-200 shadow-none" }}
                >
                  {zones.map((zone) => (
                    <SelectItem key={zone.id}>
                      {zone.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="border-t border-slate-100 px-6 py-4">
          <Button variant="light" className="font-bold text-slate-600" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" className="font-bold text-white shadow-sm" onPress={handleConfirm}>
            Confirm Reservation
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NewReservationModal;
