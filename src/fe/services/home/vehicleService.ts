import { useState } from "react";
import { ReasonOption } from "../constants";
import tagService from "../tagService";

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
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

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
      const response = await tagService.sendMessage(tagId, {
        violation: selectedReasonLabel,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to send message");
      }

      return response;
    } catch (error: any) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  const handlePrivateCall = () => {
    if (!vehicleOwner) return;
    setIsVerificationModalOpen(true);
  };

  const handleSetupCall = async (
    lastFourDigits: string,
    phoneNumber: string,
  ) => {
    if (!vehicleOwner || !tagId) return;

    try {
      // Here we would typically verify the last 4 digits with the backend
      // and setup the masked call

      // You can implement the masked call API integration here
      // For example:
      // const response = await fetch(`/api/v0/tag/${tagId}/setupMaskedCall`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     lastFourDigits,
      //     phoneNumber,
      //     vehicleId: vehicleOwner.vehicle_no,
      //   }),
      // });

      // const data = await response.json();

      // if (!data.success) {
      //   throw new Error(data.message || "Failed to setup call");
      // }

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

      // return data;
    } catch (error: any) {
      console.error("Error setting up masked call:", error);
      throw error;
    }
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
