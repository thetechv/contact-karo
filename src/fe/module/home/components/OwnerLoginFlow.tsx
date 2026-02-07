"use client";

import React, { useState } from "react";
import { FormInput } from "./FormInput";
import { OtpInput } from "@/fe/components/ui/OtpInput";
import tagService from "@/fe/services/tagService";
import { ownerModalStyles } from "../styles/ownerModalStyles";
import { OwnerLoginModal } from "./OwnerLoginModal";
import { ModalHeader } from "./ModalHeader";
import type { OwnerFormData } from "@/fe/services/home";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tagId: string;
  onSubmit: (data: OwnerFormData) => Promise<void>;
}

export default function OwnerLoginFlow({
  isOpen,
  onClose,
  tagId,
  onSubmit,
}: Props) {
  const [step, setStep] = useState<"phone" | "otp" | "details">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<OwnerFormData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [submissionLoading, setSubmissionLoading] = useState(false);

  const sendOtp = async () => {
    setError(null);
    if (!phone) return setError("Phone is required");
    try {
      setLoading(true);
      await tagService.generateOtpToUpdateTag(tagId, phone);
      setStep("otp");
    } catch (err: any) {
      setError(err?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    setError(null);
    if (!otp) return setError("Enter OTP");
    try {
      setLoading(true);
      const data = await tagService.verifyOtp(tagId, otp, phone);
      // expected response: { success: true, message: 'OTP verified', user }
      const user = (data as any).user;
      if (!user) {
        setError((data as any).message || "Verification failed");
        return;
      }
      const mapped: OwnerFormData = {
        name: user.name || "",
        phone: user.phone || "",
        whatsapp: user.whatsapp || "",
        email: user.email || "",
        vehicle_no: user.vehicle_no || "",
        vehicle_type: user.vehicle_type || "",
        emergency_contact_1: user.emergency_contact_1 || "",
        emergency_contact_2: user.emergency_contact_2 || "",
        address: user.address || "",
      };
      setUserData(mapped);
      setStep("details");
      setIsDetailsOpen(true);
    } catch (err: any) {
      setError(err?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAll = () => {
    if (submissionLoading) return; // Prevent closing during submission
    setStep("phone");
    setPhone("");
    setOtp("");
    setError(null);
    setUserData(null);
    setIsDetailsOpen(false);
    setSubmissionLoading(false);
    onClose();
  };

  const handleSubmitDetails = async (data: OwnerFormData) => {
    try {
      setSubmissionLoading(true);
      setError(null);
      await onSubmit(data);
      // Don't close modal here, let the parent component handle success
    } catch (err: any) {
      setError(err?.message || "Failed to submit details");
      setSubmissionLoading(false);
    }
  };

  return (
    <>
      {isOpen && step !== "details" && (
        <div className={ownerModalStyles.overlay}>
          <div className={ownerModalStyles.backdrop} onClick={handleCloseAll} />

          <div className={ownerModalStyles.modal}>
            <ModalHeader
              title="Update Owner Details"
              onClose={handleCloseAll}
            />

            <div className="flex-1 overflow-y-auto">
              {step === "phone" && (
                <div className={ownerModalStyles.form.container}>
                  <div className="space-y-2 mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Enter Phone Number
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We'll send you a verification code
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <FormInput
                      name="phone"
                      label="Phone"
                      type="tel"
                      value={phone}
                      required
                      placeholder="Enter phone to receive OTP"
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleCloseAll}
                      className={`flex-1 ${ownerModalStyles.form.secondaryButtonSmall}`}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={sendOtp}
                      disabled={loading || !phone.trim()}
                      className={`flex-1 ${ownerModalStyles.form.submitButtonSmall}`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="w-4 h-4 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        "Send OTP"
                      )}
                    </button>
                  </div>
                </div>
              )}

              {step === "otp" && (
                <div className={ownerModalStyles.form.container}>
                  <div className="text-center space-y-2 mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Verify OTP
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Enter the 6-digit code sent to{" "}
                      <span className="font-medium text-gray-900 dark:text-white">
                        {phone}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <OtpInput value={otp} onChange={setOtp} error={!!error} />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setStep("phone");
                        setError(null);
                        setOtp("");
                      }}
                      className={`flex-1 ${ownerModalStyles.form.secondaryButtonSmall}`}
                      disabled={loading}
                    >
                      ← Back
                    </button>
                    <button
                      onClick={verify}
                      disabled={loading || otp.length !== 6}
                      className={`flex-1 ${ownerModalStyles.form.submitButtonSmall}`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="w-4 h-4 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Verifying...
                        </span>
                      ) : (
                        "Verify OTP"
                      )}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className={ownerModalStyles.alert.error}>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">⚠️</span>
                    <span className="font-medium">{error}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Owner details modal shown after verification */}
      {userData && (
        <>
          <OwnerLoginModal
            isOpen={isDetailsOpen}
            onClose={() => {
              if (submissionLoading) return; // Prevent closing during submission
              setIsDetailsOpen(false);
              handleCloseAll();
            }}
            onSubmit={handleSubmitDetails}
            initialData={userData}
          />

          {/* Loading overlay during submission */}
          {submissionLoading && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-xl max-w-sm w-full mx-4">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                    <svg
                      className="w-8 h-8 text-yellow-600 dark:text-yellow-400 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Updating Details
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Please wait while we save your information...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
export { OwnerLoginFlow };
