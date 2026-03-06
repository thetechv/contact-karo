"use client";

import React, { useState } from "react";
import { Modal } from "@/fe/components/ui/Modal";
import { Button } from "@/fe/components/ui/Button";
import { Input } from "@/fe/components/ui/Input";
import callService from "@/fe/services/home/callService";

interface VehicleVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  plateNumber: string;
  tagId?: string;
  onSetupCall?: (lastFourDigits: string, phoneNumber: string) => void;
}

export const VehicleVerificationModal: React.FC<
  VehicleVerificationModalProps
> = ({ isOpen, onClose, plateNumber, tagId, onSetupCall }) => {
  const [lastFourDigits, setLastFourDigits] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [callSetupComplete, setCallSetupComplete] = useState(false);
  const [contactNumber, setContactNumber] = useState("");
  const [errors, setErrors] = useState<{
    lastFourDigits?: string;
    phoneNumber?: string;
    api?: string;
  }>({});

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setLastFourDigits("");
      setPhoneNumber("");
      setErrors({});
      setCallSetupComplete(false);
      setContactNumber("");
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: {
      lastFourDigits?: string;
      phoneNumber?: string;
      api?: string;
    } = {};

    if (!lastFourDigits || lastFourDigits.length !== 4) {
      newErrors.lastFourDigits = "Please enter exactly 4 digits";
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    if (!tagId) {
      newErrors.api = "Tag ID not found";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);

      try {
        // Setup masked call via API
        const response = await callService.setupMaskedCall(tagId!, {
          phone: phoneNumber,
        });

        if (response.success && response.data) {
          setContactNumber(response.data);
          setCallSetupComplete(true);

          // Don't call the callback to avoid triggering alert in useVehicleActions
          // onSetupCall?.(lastFourDigits, phoneNumber);
        } else {
          setErrors({ api: response.message || "Failed to setup masked call" });
        }
      } catch (error) {
        setErrors({ api: "Network error. Please try again." });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    onClose();
    setLastFourDigits("");
    setPhoneNumber("");
    setErrors({});
    setCallSetupComplete(false);
    setContactNumber("");
    setIsLoading(false);
  };

  const displayPlateNumber = plateNumber || "BR22BD";
  const prefixLength = Math.max(0, displayPlateNumber.length - 4);
  const prefix = displayPlateNumber.slice(0, prefixLength);
  const lastFour = displayPlateNumber.slice(-4);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      showCloseButton={false}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Header - Only show during initial form */}
        {!callSetupComplete && !isLoading && (
          <>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Please Verify the plate number of the vehicle.
              </h2>
            </div>
            <hr className="border-gray-200 dark:border-gray-700" />
          </>
        )}

        {/* Content */}
        <div className="space-y-6">
          {isLoading ? (
            /* Loading State */
            <div className="space-y-6 text-center py-8">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Setting up Masked Call...
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Please wait while we connect you with the vehicle owner
                </p>
              </div>
            </div>
          ) : !callSetupComplete ? (
            <>
              {/* Plate Number Display */}
              <div className="space-y-3">
                <p className="text-lg text-gray-900 dark:text-gray-100">
                  Please enter the last 4 digits of vehicle plate number
                </p>

                <div className="flex items-center gap-2">
                  <div className="bg-yellow-400 text-black px-3 py-2 rounded font-bold text-lg">
                    {prefix}
                    <span className="bg-black text-yellow-400 px-1 rounded">
                      ####
                    </span>
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Last 4 Digits"
                      value={lastFourDigits}
                      onChange={(e) => {
                        const input = e.target.value
                          .replace(/[^\w]/g, "")
                          .slice(0, 4);
                        setLastFourDigits(input.toUpperCase());
                        if (errors.lastFourDigits) {
                          setErrors({ ...errors, lastFourDigits: undefined });
                        }
                      }}
                      maxLength={4}
                      error={errors.lastFourDigits}
                      className="text-center text-lg font-bold"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Phone Number Section */}
              <div className="space-y-4">
                <div className="text-gray-700 dark:text-gray-300">
                  <p>We will need your phone number to setup a</p>
                  <p>
                    <span className="font-bold">MASKED</span> call between you
                    and tag owner.
                  </p>
                </div>

                <Input
                  placeholder="Your Phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    const input = e.target.value.replace(/[^\d+\-\s()]/g, "");
                    setPhoneNumber(input);
                    if (errors.phoneNumber) {
                      setErrors({ ...errors, phoneNumber: undefined });
                    }
                  }}
                  error={errors.phoneNumber}
                  disabled={isLoading}
                />
              </div>

              {/* API Error */}
              {errors.api && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {errors.api}
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Success State - Call Setup Complete */
            <div className="space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="text-center relative py-4">
                {/* Pulsing Outgoing Call Animation */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                  <div className="absolute inset-2 bg-blue-500 rounded-full animate-pulse opacity-40"></div>
                  <div className="relative flex items-center justify-center w-24 h-24 bg-blue-600 rounded-full shadow-lg shadow-blue-500/30">
                    <svg
                      className="w-10 h-10 text-white animate-bounce"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 tracking-tight">
                  Connecting Your Call...
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
                  Our system is bridging a secure, masked call between you and the vehicle owner.
                </p>
              </div>

              {/* Status Message Box */}
              <div className="bg-blue-50/80 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 rounded-2xl p-6 text-center shadow-sm">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </span>
                    <span className="text-sm font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                      Please wait for incoming call
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    You will receive an incoming call on{" "}
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {phoneNumber}
                    </span>{" "}
                    in a few seconds.
                  </p>
                </div>
              </div>

              {/* Instructions Callout */}
              <div className="bg-yellow-50/50 dark:bg-yellow-900/10 border border-yellow-100/50 dark:border-yellow-800/30 rounded-xl p-4">
                <div className="flex gap-3">
                  <div className="text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200/80 leading-snug">
                    <span className="font-semibold text-yellow-900 dark:text-yellow-100 block mb-1">Stay on this screen.</span>
                    Please keep your line free and answer the incoming call to speak with the owner.
                  </p>
                </div>
              </div>

              {/* Fallback Action */}
              <div className="pt-2 text-center text-xs text-gray-500 dark:text-gray-500">
                If the call doesn't connect within 60 seconds, please try again.
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {!isLoading && <hr className="border-gray-200 dark:border-gray-700" />}
        <div className="space-y-4">
          {!callSetupComplete ? (
            <>
              <Button
                onClick={handleSubmit}
                className="w-full py-4 text-lg font-semibold"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Setting up call...
                  </div>
                ) : (
                  "Setup Masked Call"
                )}
              </Button>

              <div className="text-center">
                <button
                  onClick={handleClose}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <Button
              onClick={handleClose}
              className="w-full py-4 text-lg font-semibold"
              size="lg"
              variant="outline"
            >
              Close
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
