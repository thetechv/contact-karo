import { useState } from "react";
import { VehicleOwner, ReasonOption } from "../constants";

interface UseVehicleActionsProps {
  vehicleOwner: VehicleOwner | null;
  selectedReason: string | null;
  reasonOptions: ReasonOption[];
  tagId: string;
}

export function useVehicleActions({
  vehicleOwner,
  selectedReason,
  reasonOptions,
  tagId,
}: UseVehicleActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

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
    setIsVerificationModalOpen(true);
  };

  const handleSetupCall = (lastFourDigits: string, phoneNumber: string) => {
    if (!vehicleOwner) return;

    // Here we would typically verify the last 4 digits with the backend
    // For now, we'll setup the masked call

    // You can implement the masked call API integration here
    console.log(
      "Setting up masked call between:",
      phoneNumber,
      "and",
      vehicleOwner.phone,
    );
    console.log(
      "Verifying last 4 digits:",
      lastFourDigits,
      "for plate:",
      vehicleOwner.vehicle_no,
    );

    // For now, just show an alert - replace this with actual API call
    alert(
      `Setting up masked call between ${phoneNumber} and vehicle owner for plate ${vehicleOwner.vehicle_no}`,
    );

    setIsVerificationModalOpen(false);
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
    isVerificationModalOpen,
    setIsVerificationModalOpen,
    handleMessage,
    handleSendMessage,
    handlePrivateCall,
    handleSetupCall,
    handleDocuments,
    handleEmergency,
  };
}
