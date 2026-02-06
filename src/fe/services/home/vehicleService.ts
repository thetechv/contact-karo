import { useState } from "react";
import { ReasonOption } from "../constants";

// Types
export interface VehicleOwner {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  vehicle_no: string;
  vehicle_type: string;
  emergency_contact_1: string;
  emergency_contact_2: string;
  address: string;
}

interface UseVehicleActionsProps {
  vehicleOwner: VehicleOwner | null;
  selectedReason: string | null;
  reasonOptions: ReasonOption[];
}

// Vehicle actions hook service
export function useVehicleActions({
  vehicleOwner,
  selectedReason,
  reasonOptions,
}: UseVehicleActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMessage = () => {
    setIsModalOpen(true);
  };

  const handleSendMessage = (
    additionalMessage: string,
    phoneNumber: string,
  ) => {
    if (!vehicleOwner) return;

    const selectedReasonLabel =
      reasonOptions.find((r) => r.id === selectedReason)?.label || "";

    let message = `Hi ${vehicleOwner.name}, I need to contact you regarding your vehicle ${vehicleOwner.vehicle_no}.\n\nReason: ${selectedReasonLabel}`;

    if (additionalMessage) {
      message += `\n\nAdditional Details: ${additionalMessage}`;
    }

    if (phoneNumber) {
      message += `\n\nYou can reach me at: ${phoneNumber}`;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${vehicleOwner.whatsapp}?text=${encodedMessage}`,
      "_blank",
    );

    setIsModalOpen(false);
  };

  const handlePrivateCall = () => {
    if (!vehicleOwner) return;
    window.location.href = `tel:${vehicleOwner.phone}`;
  };

  const handleDocuments = () => {
    if (!vehicleOwner) return;
    alert(
      `Owner: ${vehicleOwner.name}\nEmail: ${vehicleOwner.email}\nAddress: ${vehicleOwner.address}`,
    );
  };

  const handleEmergency = () => {
    if (!vehicleOwner?.emergency_contact_1) return;
    window.location.href = `tel:${vehicleOwner.emergency_contact_1}`;
  };

  return {
    isModalOpen,
    setIsModalOpen,
    handleMessage,
    handleSendMessage,
    handlePrivateCall,
    handleDocuments,
    handleEmergency,
  };
}
