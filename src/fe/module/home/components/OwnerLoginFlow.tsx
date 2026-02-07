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
              <div className={ownerModalStyles.header.title}>Owner Login</div>
            </div>

            <div className={ownerModalStyles.form.container}>
              {step === "phone" && (
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
                  {error && <div className="text-red-500">{error}</div>}
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={handleCloseAll}
                      className={ownerModalStyles.form.submitButton}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={sendOtp}
                      disabled={loading}
                      className={ownerModalStyles.form.submitButton}
                    >
                      {loading ? "Sending..." : "Send OTP"}
                    </button>
                  </div>
                </div>
              )}

              {step === "otp" && (
                <div className="space-y-4">
                  <p className="text-sm">Enter the OTP sent to {phone}</p>
                  <OtpInput value={otp} onChange={setOtp} />
                  {error && <div className="text-red-500">{error}</div>}
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setStep("phone")}
                      className={ownerModalStyles.form.submitButton}
                    >
                      Back
                    </button>
                    <button
                      onClick={verify}
                      disabled={loading}
                      className={ownerModalStyles.form.submitButton}
                    >
                      {loading ? "Verifying..." : "Verify OTP"}
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
