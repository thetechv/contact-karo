"use client";

import React, { useState, useEffect } from "react";
import {
  VehicleInfo,
  ReasonSelector,
  ActionButtons,
  MessageModal,
} from "@/module/home/components";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  getRandomVehicleOwner,
  type VehicleOwner,
} from "@/module/home/constants";

export default function HomePage() {
  const [selectedReason, setSelectedReason] = useState<string | null>(
    "no-parking",
  );
  const [vehicleOwner, setVehicleOwner] = useState<VehicleOwner | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load a random vehicle owner on component mount
  useEffect(() => {
    const owner = getRandomVehicleOwner();
    setVehicleOwner(owner);
  }, []);

  if (!vehicleOwner) {
    return null; // Or a loading state
  }

  const reasonOptions = [
    {
      id: "lights-on",
      icon: "☀️",
      label: "The lights of this car is on.",
    },
    {
      id: "no-parking",
      icon: "⚠️",
      label: "The car is in no parking.",
    },
    {
      id: "getting-towed",
      icon: "🚗",
      label: "The car is getting towed.",
    },
    {
      id: "window-open",
      icon: "🚪",
      label: "The window or car is open.",
    },
    {
      id: "something-wrong",
      icon: "⚠️",
      label: "Something wrong with this car.",
    },
  ];

  const handleMessage = () => {
    setIsModalOpen(true);
  };

  const handleSendMessage = (
    additionalMessage: string,
    phoneNumber: string,
  ) => {
    console.log("Message action:", selectedReason);
    console.log("Vehicle Owner:", vehicleOwner);
    console.log("Additional Message:", additionalMessage);
    console.log("User Phone:", phoneNumber);

    // Find the selected reason label
    const selectedReasonLabel =
      reasonOptions.find((r) => r.id === selectedReason)?.label || "";

    // Build the WhatsApp message
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

    // Close modal
    setIsModalOpen(false);
  };

  const handlePrivateCall = () => {
    console.log("Private call action:", selectedReason);
    console.log("Calling:", vehicleOwner.phone);
    window.location.href = `tel:${vehicleOwner.phone}`;
  };

  const handleDocuments = () => {
    console.log("Documents action");
    console.log("Vehicle Owner Details:", vehicleOwner);
    alert(
      `Owner: ${vehicleOwner.name}\nEmail: ${vehicleOwner.email}\nAddress: ${vehicleOwner.address}`,
    );
  };

  const handleEmergency = () => {
    console.log("Emergency action:", selectedReason);
    console.log("Emergency Contacts:", {
      primary: vehicleOwner.emergency_contact_1,
      secondary: vehicleOwner.emergency_contact_2,
    });
    if (vehicleOwner.emergency_contact_1) {
      window.location.href = `tel:${vehicleOwner.emergency_contact_1}`;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Mobile Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Contact
            </h1>
            <span className="text-xs bg-yellow-400 text-black px-2 py-0.5 rounded font-semibold">
              Karo
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content - Mobile First */}
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Vehicle Information */}
        <VehicleInfo
          vehicleName={vehicleOwner.name}
          plateNumber={vehicleOwner.vehicle_no}
          vehicleType={vehicleOwner.vehicle_type}
        />

        {/* Reason Selector */}
        <ReasonSelector
          options={reasonOptions}
          selectedReason={selectedReason}
          onSelect={setSelectedReason}
        />

        {/* Action Buttons */}
        <ActionButtons
          onMessage={handleMessage}
          onPrivateCall={handlePrivateCall}
          onEmergency={handleEmergency}
        />

        {/* Owner Login Section */}
        <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-blue-200 dark:border-gray-600">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <span className="text-2xl">👤</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Are you the vehicle owner?
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
                Login to update your contact details, manage emergency contacts,
                and ensure people can reach you when needed.
              </p>
              <button
                onClick={() => {
                  // Handle login navigation
                  console.log("Navigate to login");
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                <span>Login to Update Details</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Message Modal */}
      <MessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedReason={selectedReason}
        onSend={handleSendMessage}
        reasonOptions={reasonOptions}
      />
    </div>
  );
}
