"use client";

import React, { useState } from "react";
import { Modal } from "@/fe/components/ui/Modal";
import { Button } from "@/fe/components/ui/Button";
import { Input } from "@/fe/components/ui/Input";

interface VehicleVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  plateNumber: string;
  onSetupCall: (lastFourDigits: string, phoneNumber: string) => void;
}

export const VehicleVerificationModal: React.FC<
  VehicleVerificationModalProps
> = ({ isOpen, onClose, plateNumber, onSetupCall }) => {
  const [lastFourDigits, setLastFourDigits] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<{
    lastFourDigits?: string;
    phoneNumber?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { lastFourDigits?: string; phoneNumber?: string } = {};

    if (!lastFourDigits || lastFourDigits.length !== 4) {
      newErrors.lastFourDigits = "Please enter exactly 4 digits";
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSetupCall(lastFourDigits, phoneNumber);
      onClose();
      setLastFourDigits("");
      setPhoneNumber("");
      setErrors({});
    }
  };

  const handleClose = () => {
    onClose();
    setLastFourDigits("");
    setPhoneNumber("");
    setErrors({});
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
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Please Verify the plate number of the vehicle.
          </h2>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Content */}
        <div className="space-y-6">
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
                />
              </div>
            </div>
          </div>

          {/* Phone Number Section */}
          <div className="space-y-4">
            <div className="text-gray-700 dark:text-gray-300">
              <p>We will need your phone number to setup a</p>
              <p>
                <span className="font-bold">MASKED</span> call between you and
                tag owner.
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
            />
          </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Actions */}
        <div className="space-y-4">
          <Button
            onClick={handleSubmit}
            className="w-full py-4 text-lg font-semibold"
            size="lg"
          >
            Setup Masked Call
          </Button>

          <div className="text-center">
            <button
              onClick={handleClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
