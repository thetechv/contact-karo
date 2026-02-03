"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  VehicleInfo,
  ReasonSelector,
  ActionButtons,
  MessageModal,
  OwnerLoginSection,
  OwnerLoginModal,
  EmptyState,
  RegisterModal,
} from "@/fe/module/home/components";
import { ThemeToggle } from "@/fe/components/ui/ThemeToggle";
import { reasonOptions, type VehicleOwner } from "@/fe/module/home/constants";
import {
  useVehicleOwner,
  useVehicleActions,
  type OwnerFormData,
} from "@/fe/module/home/hooks";
import { pageStyles } from "@/fe/module/home/styles/pageStyles";

export default function HomePage() {
  const params = useParams();
  const idParam = params?.id;
  const id = Array.isArray(idParam)
    ? (idParam[0] ?? "")
    : ((idParam as string | undefined) ?? "");

  const [selectedReason, setSelectedReason] = useState<string | null>(
    "no-parking",
  );
  const [isOwnerLoginModalOpen, setIsOwnerLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { isLoading, vehicleOwner } = useVehicleOwner(id);

  const {
    isModalOpen,
    setIsModalOpen,
    handleMessage,
    handleSendMessage,
    handlePrivateCall,
    handleEmergency,
  } = useVehicleActions({
    vehicleOwner,
    selectedReason,
    reasonOptions,
  });

  const handleLoginClick = () => {
    setIsOwnerLoginModalOpen(true);
  };

  const handleOwnerFormSubmit = (data: OwnerFormData) => {
    console.log("Owner details submitted:", data);
    // TODO: Send data to API
    setIsOwnerLoginModalOpen(false);
  };

  const handleRegisterClick = () => {
    setIsRegisterModalOpen(true);
  };

  const handleRegisterSuccess = () => {
    // Refresh vehicle owner data after successful registration
    window.location.reload();
  };

  return (
    <div className={pageStyles.container}>
      {vehicleOwner && !isLoading && (
        <>
          <main className={pageStyles.main}>
            <VehicleInfo
              vehicleName={vehicleOwner?.name}
              plateNumber={vehicleOwner.vehicle_no}
              vehicleType={vehicleOwner.vehicle_type}
            />

            <ReasonSelector
              options={reasonOptions}
              selectedReason={selectedReason}
              onSelect={setSelectedReason}
            />

            <ActionButtons
              onMessage={handleMessage}
              onPrivateCall={handlePrivateCall}
              onEmergency={handleEmergency}
            />

            <OwnerLoginSection onLoginClick={handleLoginClick} />
          </main>

          <MessageModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            selectedReason={selectedReason}
            onSend={handleSendMessage}
            reasonOptions={reasonOptions}
          />

          <OwnerLoginModal
            isOpen={isOwnerLoginModalOpen}
            onClose={() => setIsOwnerLoginModalOpen(false)}
            onSubmit={handleOwnerFormSubmit}
          />
        </>
      )}
      {!vehicleOwner && !isLoading && (
        <>
          <EmptyState onRegisterClick={handleRegisterClick} />
          <RegisterModal
            isOpen={isRegisterModalOpen}
            onClose={() => setIsRegisterModalOpen(false)}
            tagId={id}
            onSuccess={handleRegisterSuccess}
          />
        </>
      )}
      {isLoading && <div>Loading...</div>}
    </div>
  );
}
