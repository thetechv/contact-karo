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
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Masked Call Setup Successful!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  You can now contact the owner
                </p>
              </div>

              {/* Contact Information */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  Contact Details
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-700 dark:text-blue-300 font-medium">
                      Vehicle Owner:
                    </span>
                    <span className="text-blue-900 dark:text-blue-100 font-bold">
                      {contactNumber}
                    </span>
                  </div>
                </div>
              </div>

              {/* Call Button */}
              <div className="space-y-4">
                <Button
                  onClick={() => window.open(`tel:${contactNumber}`)}
                  className="w-full py-4 text-lg font-semibold bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  📞 Call Now
                </Button>

                {/* Warning/Instructions */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-yellow-600 dark:text-yellow-400 mt-0.5">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium text-yellow-800 dark:text-yellow-200">
                        Important Guidelines:
                      </h5>
                      <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                        <li>
                          • This call is for legitimate vehicle-related
                          emergencies only
                        </li>
                        <li>
                          • Do not use this service for testing or non-emergency
                          purposes
                        </li>
                        <li>
                          • Your number may be logged for security purposes
                        </li>
                        <li>• Be respectful and courteous when calling</li>
                      </ul>
                    </div>
                  </div>
                </div>
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
