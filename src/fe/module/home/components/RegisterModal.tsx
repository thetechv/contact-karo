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
            <div className="mx-6 mt-6 mb-0 p-4 bg-red-50 dark:bg-red-900/20 border border-red-600 dark:border-red-500 text-red-700 dark:text-red-400 rounded-xl outline-none">
              <div className="flex items-center gap-3">
                <span className="text-2xl flex-shrink-0">⚠️</span>
                <span className="font-semibold">{error}</span>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mx-6 mt-6 mb-0 p-4 bg-green-50 dark:bg-green-900/20 border border-green-600 dark:border-green-500 text-green-700 dark:text-green-400 rounded-xl outline-none">
              <div className="flex items-center gap-3">
                <span className="text-2xl flex-shrink-0">✓</span>
                <span className="font-semibold">{successMessage}</span>
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
              {isSubmitting ? "⏳ Registering..." : "Register Vehicle 🚀"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
