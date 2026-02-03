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
  const { isLoading, vehicleOwner, error } = useVehicleOwner(id);

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
      {isLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      )}

      {error && !isLoading && (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-6 max-w-md">
            <h2 className="text-red-800 dark:text-red-400 font-semibold mb-2">
              Error Loading Tag
            </h2>
            <p className="text-red-600 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      {vehicleOwner && !isLoading && !error && (
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

      {!vehicleOwner && !isLoading && !error && (
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
    </div>
  );
}
