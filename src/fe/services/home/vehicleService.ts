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
  tagId: string;
}

// Vehicle actions hook service
export function useVehicleActions({
  vehicleOwner,
  selectedReason,
  reasonOptions,
  tagId,
}: UseVehicleActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMessage = () => {
    setIsModalOpen(true);
  };

  const handleSendMessage = async (
    additionalMessage: string,
    phoneNumber: string,
    reasonId?: string,
  ) => {
    if (!vehicleOwner || !tagId) return;

    const finalReasonId = reasonId || selectedReason;
    const selectedReasonLabel =
      reasonOptions.find((r) => r.id === finalReasonId)?.label || "";

    /* 
       Note: The backend Twilio template currently only supports 'violation' (reason).
       'additionalMessage' and 'phoneNumber' are not supported by the template yet.
    */

    try {
      const response = await fetch(`/api/v0/tag/${tagId}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          violation: selectedReasonLabel,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to send message");
      }

      return data;
    } catch (error: any) {
      console.error("Error sending message:", error);
      throw error;
    }
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
