"use client";

import React, { useState } from "react";
import {
  VehicleInfo,
  ReasonSelector,
  ActionButtons,
  MessageModal,
  OwnerLoginSection,
  OwnerLoginModal,
  EmptyState,
} from "@/module/home/components";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { reasonOptions } from "@/module/home/constants";
import {
  useVehicleOwner,
  useVehicleActions,
  type OwnerFormData,
} from "@/module/home/hooks";
import { pageStyles } from "@/module/home/styles/pageStyles";

export default function HomePage() {
  const [selectedReason, setSelectedReason] = useState<string | null>(
    "no-parking",
  );
  const [isOwnerLoginModalOpen, setIsOwnerLoginModalOpen] = useState(false);
  const vehicleOwner = useVehicleOwner();

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

  if (!vehicleOwner) {
    return <EmptyState />;
  }

  return (
    <div className={pageStyles.container}>
      <header className={pageStyles.header}>
        <div className={pageStyles.headerContent}>
          <div className={pageStyles.logo}>
            <h1 className={pageStyles.title}>Contact</h1>
            <span className={pageStyles.badge}>Karo</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className={pageStyles.main}>
        <VehicleInfo
          vehicleName={vehicleOwner.name}
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
    </div>
  );
}
