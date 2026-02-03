"use client";

import React, { useState } from "react";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { registerFormFields } from "../constants";
import { ownerModalStyles } from "../styles/ownerModalStyles";
import { FormInput } from "./FormInput";
import { FormTextarea } from "./FormTextarea";
import { FormSelect } from "./FormSelect";
import { ModalHeader } from "./ModalHeader";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  tagId: string;
  onSuccess?: () => void;
}

export function RegisterModal({
  isOpen,
  onClose,
  tagId,
  onSuccess,
}: RegisterModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSuccess = () => {
    setSuccessMessage("Vehicle registered successfully!");
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
      onSuccess?.();
    }, 2000);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => setError(null), 5000);
  };

  const { formData, handleChange, handleSubmit, isSubmitting } =
    useRegisterForm(tagId, handleSuccess, handleError);

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

    // Full-width fields: address and email
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

  return (
    <div className={ownerModalStyles.overlay}>
      <div className={ownerModalStyles.backdrop} onClick={onClose} />

      <div className={ownerModalStyles.modal}>
        <ModalHeader title="Register Your Vehicle" onClose={onClose} />

        <div className="flex-1 overflow-y-auto">
          {error && (
            <div className="mx-6 mt-6 mb-0 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-600 text-red-700 dark:text-red-400 rounded-r-lg shadow-sm">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mx-6 mt-6 mb-0 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-600 text-green-700 dark:text-green-400 rounded-r-lg shadow-sm">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">{successMessage}</span>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className={ownerModalStyles.form.container}
          >
            <div className={ownerModalStyles.form.grid}>
              {registerFormFields.map(renderField)}
            </div>

            <button
              type="submit"
              className={ownerModalStyles.form.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
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
                  Registering...
                </span>
              ) : (
                "Register Vehicle"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
