"use client";

import React, { useState } from "react";
import {
  VehicleInfo,
  ReasonSelector,
  ActionButtons,
} from "@/module/home/components";

export default function HomePage() {
  const [selectedReason, setSelectedReason] = useState<string | null>(
    "no-parking",
  );

  // Exact data from mockup
  const vehicleData = {
    name: "",
    plateNumber: "UP85BF1234",
    maskedDigits: "",
  };

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
    console.log("Message action:", selectedReason);
    // Handle message logic
  };

  const handlePrivateCall = () => {
    console.log("Private call action:", selectedReason);
    // Handle call logic
  };

  const handleDocuments = () => {
    console.log("Documents action");
    // Handle documents logic
  };

  const handleEmergency = () => {
    console.log("Emergency action:", selectedReason);
    // Handle emergency logic
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
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <svg
              className="w-6 h-6 text-gray-900 dark:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content - Mobile First */}
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Vehicle Information */}
        <VehicleInfo
          vehicleName={vehicleData.name}
          plateNumber={vehicleData.plateNumber}
          maskedDigits={vehicleData.maskedDigits}
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
          onDocuments={handleDocuments}
          onEmergency={handleEmergency}
        />
      </main>
    </div>
  );
}
