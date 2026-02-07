"use client";

import React from "react";
import {
  VehicleInfo,
  ReasonSelector,
  ActionButtons,
  MessageModal,
  OwnerLoginSection,
  OwnerLoginFlow,
  EmptyState,
  RegisterModal,
} from "@/fe/module/home/components";
import { reasonOptions, getReasonOptions } from "@/fe/services/constants";
import {
  useVehicleOwner,
  useVehicleActions,
  useTagPageModals,
  useOwnerFormSubmission,
  useReasonSelector,
  useRegistration,
  useTagId,
} from "@/fe/services/home";
import { pageStyles } from "@/fe/module/home/styles/pageStyles";

export function TagPage() {
  const { id } = useTagId();
  const { selectedReason, setSelectedReason } = useReasonSelector("no-parking");
  const { isLoading, vehicleOwner, error } = useVehicleOwner(id);

  const currentReasonOptions = getReasonOptions(vehicleOwner?.vehicle_type);

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
    reasonOptions: currentReasonOptions,
  });

  const {
    isOwnerLoginModalOpen,
    openOwnerLoginModal,
    closeOwnerLoginModal,
    isRegisterModalOpen,
    openRegisterModal,
    closeRegisterModal,
  } = useTagPageModals();

  const { submitOwnerForm } = useOwnerFormSubmission({
    tagId: id,
    onSuccess: () => {
      // Refresh page to show updated owner data
      window.location.reload();
    },
    onError: (message) => {
      alert(message);
    },
  });

  const { handleRegistrationSuccess } = useRegistration({
    onSuccess: () => {
      // Refresh vehicle owner data after successful registration
      window.location.reload();
    },
  });

  const handleOwnerFormSubmit = async (data: any) => {
    try {
      await submitOwnerForm(data);
      closeOwnerLoginModal();
    } catch (error) {
      // Error will be handled by the OwnerLoginFlow component
      throw error;
    }
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
              options={currentReasonOptions}
              selectedReason={selectedReason}
              onSelect={setSelectedReason}
            />

            <ActionButtons
              onMessage={handleMessage}
              onPrivateCall={handlePrivateCall}
              onEmergency={handleEmergency}
            />

            <OwnerLoginSection onLoginClick={openOwnerLoginModal} />
          </main>

          <MessageModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            selectedReason={selectedReason}
            onSend={handleSendMessage}
            reasonOptions={currentReasonOptions}
          />

          <OwnerLoginFlow
            isOpen={isOwnerLoginModalOpen}
            onClose={closeOwnerLoginModal}
            tagId={id}
            onSubmit={handleOwnerFormSubmit}
          />
        </>
      )}

      {!vehicleOwner && !isLoading && !error && (
        <>
          <EmptyState onRegisterClick={openRegisterModal} />
          <RegisterModal
            isOpen={isRegisterModalOpen}
            onClose={closeRegisterModal}
            tagId={id}
            onSuccess={handleRegistrationSuccess}
          />
        </>
      )}
    </div>
  );
}
