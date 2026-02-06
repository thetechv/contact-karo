"use client";

import React, { useState, useEffect } from "react";
import { registerFormFields } from "../constants";
import { ownerModalStyles } from "../styles/ownerModalStyles";
import { FormInput } from "./FormInput";
import { FormTextarea } from "./FormTextarea";
import { FormSelect } from "./FormSelect";
import { ModalHeader } from "./ModalHeader";
import tagService from "@/fe/services/tagService";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  tagId: string;
  onSuccess?: () => void;
}

type Step = "form" | "otp";

const initialFormData = {
  name: "",
  phone: "",
  whatsapp: "",
  email: "",
  vehicle_no: "",
  vehicle_type: "car",
  emergency_contact_1: "",
  emergency_contact_2: "",
  address: "",
};

export function RegisterModal({
  isOpen,
  onClose,
  tagId,
  onSuccess,
}: RegisterModalProps) {
  const [step, setStep] = useState<Step>("form");
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneNumber = (formData.phone || "").replace(/\D/g, "").slice(0, 10);
    if (phoneNumber.length !== 10) {
      setError("Enter valid 10-digit phone number");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await tagService.generateOtp(tagId, phoneNumber);
      if (response.success) {
        setStep("otp");
        setOtpTimer(120); // 2 minutes
        setFormData({ ...formData, phone: phoneNumber });
      } else {
        setError(response.message || "Failed to send OTP");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to send OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtpAndContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Enter 6-digit OTP");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await tagService.activateTag(tagId, {
        otp,
        ...formData,
      });

      if (response.success) {
        setSuccessMessage("Vehicle registered successfully!");
        setTimeout(() => {
          setSuccessMessage(null);
          onClose();
          onSuccess?.();
          // Reset form
          setStep("form");
          setOtp("");
          setFormData(initialFormData);
        }, 2000);
      } else {
        setError(response.message || "Failed to register vehicle");
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred while registering");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await tagService.activateTag(tagId, {
        otp,
        ...formData,
      });

      if (response.success) {
        setSuccessMessage("Vehicle registered successfully!");
        setTimeout(() => {
          setSuccessMessage(null);
          onClose();
          onSuccess?.();
          // Reset form
            setStep("form");
            setOtp("");
            setFormData(initialFormData);
        }, 2000);
      } else {
        setError(response.message || "Failed to register vehicle");
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred while registering");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const renderField = (field: (typeof registerFormFields)[0]) => {
    const fieldElement =
      field.type === "textarea" ? (
        <FormTextarea
          name={field.name}
          label={field.label}
          value={formData[field.name as keyof typeof formData] || ""}
          required={field.required}
          placeholder={field.placeholder}
          rows={field.rows || 3}
          onChange={handleChange}
        />
      ) : field.type === "select" ? (
        <FormSelect
          name={field.name}
          label={field.label}
          value={formData[field.name as keyof typeof formData] || ""}
          required={field.required}
          placeholder={field.placeholder}
          options={field.options || []}
          onChange={handleChange}
        />
      ) : (
        <FormInput
          name={field.name}
          label={field.label}
          type={field.type as "text" | "tel" | "email"}
          value={formData[field.name as keyof typeof formData] || ""}
          required={field.required}
          placeholder={field.placeholder}
          onChange={handleChange}
        />
      );

    const isFullWidth = ["address", "email"].includes(field.name);
    return (
      <div
        key={field.name}
        className={isFullWidth ? ownerModalStyles.form.fullWidth : ""}
      >
        {fieldElement}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className={ownerModalStyles.overlay}>
      <div className={ownerModalStyles.backdrop} onClick={onClose} />

      <div className={ownerModalStyles.modal}>
        <ModalHeader
          title={
            step === "form"
              ? "Register Vehicle"
              : step === "otp"
                ? "Verify OTP"
                : "Vehicle Details"
          }
          onClose={onClose}
        />

        <div className="flex-1 overflow-y-auto">
          {error && (
            <div className="mx-6 mt-6 mb-0 p-4 bg-red-50 dark:bg-red-900/20 border border-red-600 dark:border-red-500 text-red-700 dark:text-red-400 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl shrink-0">⚠️</span>
                <span className="font-semibold">{error}</span>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mx-6 mt-6 mb-0 p-4 bg-green-50 dark:bg-green-900/20 border border-green-600 dark:border-green-500 text-green-700 dark:text-green-400 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl shrink-0">✓</span>
                <span className="font-semibold">{successMessage}</span>
              </div>
            </div>
          )}

          {step === "form" && (
            <form
              noValidate
              onSubmit={handleRequestOtp}
              className={ownerModalStyles.form.container}
            >
              <div className={ownerModalStyles.form.grid}>
                {registerFormFields.map(renderField)}
              </div>

              <div className="flex gap-3 p-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-full border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold transition-all"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-yellow-400 text-black hover:bg-yellow-500 px-6 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                  disabled={
                    isSubmitting ||
                    (formData.phone || "").replace(/\D/g, "").length !== 10
                  }
                >
                  {isSubmitting ? "⏳ Sending..." : "Next ➜"}
                </button>
              </div>
            </form>
          )}

          {step === "otp" && (
            <form
              onSubmit={handleVerifyOtpAndContinue}
              className="p-6 space-y-4"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                Enter 6-digit OTP sent to {formData.phone}
              </p>
              <div className="flex gap-2 justify-center mb-4">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[i] || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      const newOtp = otp.split("");
                      newOtp[i] = val;
                      setOtp(newOtp.join("").slice(0, 6));
                      if (val && i < 5) {
                        const nextInput = e.target
                          .nextElementSibling as HTMLInputElement;
                        nextInput?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otp[i] && i > 0) {
                        const prevInput = (e.target as HTMLInputElement)
                          .previousElementSibling as HTMLInputElement;
                        prevInput?.focus();
                      }
                    }}
                    className="w-12 h-14 text-center text-2xl font-bold rounded-lg border-2 border-gray-300 dark:border-gray-700 focus:border-yellow-400 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                ))}
              </div>
              {otpTimer > 0 && (
                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                  OTP expires in: {Math.floor(otpTimer / 60)}:
                  {(otpTimer % 60).toString().padStart(2, "0")}
                </p>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="flex-1 px-6 py-3 rounded-full border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-yellow-400 text-black hover:bg-yellow-500 px-6 py-3 rounded-full font-semibold transition-all"
                  disabled={otp.length !== 6}
                >
                  Continue ➜
                </button>
              </div>
            </form>
          )}

          {/* previously the vehicle details form was here; it's now the first step */}
        </div>
      </div>
    </div>
  );
}
