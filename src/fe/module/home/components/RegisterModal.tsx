"use client";

import React, { useState, useEffect } from "react";
import { Form, Field } from "formik";
import {
  EnhancedForm,
  FormFieldWrapper,
  FormikSubmitButton,
  vehicleRegistrationSchema,
  type VehicleRegistrationFormData,
  type ApiResponse,
} from "@/fe/lib/validation";
import { registerFormFields } from "../constants";
import { ownerModalStyles } from "../styles/ownerModalStyles";
import { FormTextarea } from "./FormTextarea";
import { FormSelect } from "./FormSelect";
import { FormInput } from "./FormInput";
import { ModalHeader } from "./ModalHeader";
import { OtpInput } from "@/fe/components/ui/OtpInput";
import tagService from "@/fe/services/tagService";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  tagId: string;
  onSuccess?: () => void;
}

const initialValues: VehicleRegistrationFormData = {
  name: "",
  phone: "",
  whatsapp: "",
  email: "",
  vehicle_no: "",
  vehicle_type: "",
  emergency_contact_1: "",
  emergency_contact_2: "",
  address: "",
};

type Step = "form" | "otp";

const initialFormData = {
  name: "",
  phone: "",
  whatsapp: "",
  email: "",
  vehicle_no: "",
  vehicle_type: "",
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
            <div className={ownerModalStyles.alert.error}>
              <div className="flex items-center gap-3">
                <span className="text-lg">⚠️</span>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {successMessage && (
            <div className={ownerModalStyles.alert.success}>
              <div className="flex items-center gap-3">
                <span className="text-lg">✅</span>
                <span className="font-medium">{successMessage}</span>
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
                {registerFormFields
                  .filter((f) => f.name !== "vehicle_type")
                  .map(renderField)}
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className={`flex-1 ${ownerModalStyles.form.secondaryButtonSmall}`}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 ${ownerModalStyles.form.submitButtonSmall}`}
                  disabled={
                    isSubmitting ||
                    (formData.phone || "").replace(/\D/g, "").length !== 10
                  }
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2 text-sm">
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
                    <span className="text-sm">Next →</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === "otp" && (
            <div className="p-8 space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Verify OTP
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enter the 6-digit code sent to{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formData.phone}
                  </span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtpAndContinue} className="space-y-6">
                {/* OTP Input */}
                <div className="space-y-4">
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    length={6}
                    error={!!error}
                  />

                  {error && (
                    <div className={ownerModalStyles.alert.error}>
                      <p className="text-sm text-center">{error}</p>
                    </div>
                  )}
                </div>

                {/* Timer */}
                {otpTimer > 0 && (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <svg
                        className="w-4 h-4 text-blue-600 dark:text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Expires in {Math.floor(otpTimer / 60)}:
                        {(otpTimer % 60).toString().padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("form");
                      setError(null);
                      setOtp("");
                    }}
                    className={`flex-1 ${ownerModalStyles.form.secondaryButton}`}
                    disabled={isSubmitting}
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 ${ownerModalStyles.form.submitButton}`}
                    disabled={otp.length !== 6 || isSubmitting}
                  >
                    {isSubmitting ? (
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
                      "Continue →"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* previously the vehicle details form was here; it's now the first step */}
        </div>
      </div>
    </div>
  );
}
