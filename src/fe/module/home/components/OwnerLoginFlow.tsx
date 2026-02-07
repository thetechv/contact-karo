"use client";

import React, { useState } from "react";
import { FormInput } from "./FormInput";
import { OtpInput } from "@/fe/components/ui/OtpInput";
import tagService from "@/fe/services/tagService";
import { ownerModalStyles } from "../styles/ownerModalStyles";
import { OwnerLoginModal } from "./OwnerLoginModal";
import type { OwnerFormData } from "@/fe/services/home";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tagId: string;
  onSubmit: (data: OwnerFormData) => void;
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
    setStep("phone");
    setPhone("");
    setOtp("");
    setError(null);
    setUserData(null);
    setIsDetailsOpen(false);
    onClose();
  };

  return (
    <>
      {isOpen && step !== "details" && (
        <div className={ownerModalStyles.overlay}>
          <div className={ownerModalStyles.backdrop} onClick={handleCloseAll} />

          <div className={ownerModalStyles.modal}>
            <div className={ownerModalStyles.header.container}>
              <div className={ownerModalStyles.header.title}>Update Owner Details</div>
            </div>

            <div className={ownerModalStyles.form.container}>
              {step === "phone" && (
                <div className="space-y-6 p-6">
                  <div className="text-center space-y-2">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Enter Phone Number
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We'll send you a verification code
                    </p>
                  </div>

                  <div className="space-y-4">
                    <FormInput
                      name="phone"
                      label="Phone"
                      type="tel"
                      value={phone}
                      required
                      placeholder="Enter phone to receive OTP"
                      onChange={(e) => setPhone(e.target.value)}
                    />

                    {error && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                        <p className="text-sm text-red-600 dark:text-red-400 text-center">
                          {error}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleCloseAll}
                      className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={sendOtp}
                      disabled={loading || !phone.trim()}
                      className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
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
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Verify OTP
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Enter the 6-digit code sent to{" "}
                      <span className="font-medium text-gray-900 dark:text-white">
                        {phone}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-4">
                    <OtpInput value={otp} onChange={setOtp} error={!!error} />

                    {error && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                        <p className="text-sm text-red-600 dark:text-red-400 text-center">
                          {error}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setStep("phone");
                        setError(null);
                        setOtp("");
                      }}
                      className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                      disabled={loading}
                    >
                      ← Back
                    </button>
                    <button
                      onClick={verify}
                      disabled={loading || otp.length !== 6}
                      className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
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
            </div>
          </div>
        </div>
      )}

      {/* Owner details modal shown after verification */}
      {userData && (
        <OwnerLoginModal
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            handleCloseAll();
          }}
          onSubmit={(data) => {
            onSubmit(data);
            handleCloseAll();
          }}
          initialData={userData}
        />
      )}
    </>
  );
}
export { OwnerLoginFlow };
