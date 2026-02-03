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
  };

  const { formData, handleChange, handleSubmit, isSubmitting } =
    useRegisterForm(tagId, handleSuccess, handleError);

  if (!isOpen) return null;

  return (
    <div className={ownerModalStyles.overlay}>
      <div className={ownerModalStyles.backdrop} onClick={onClose} />

      <div className={ownerModalStyles.modal}>
        <ModalHeader title="Register Your Vehicle" onClose={onClose} />

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-400 rounded-lg">
            {successMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className={ownerModalStyles.form.container}
        >
          {registerFormFields.map((field) =>
            field.type === "textarea" ? (
              <FormTextarea
                key={field.name}
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
                key={field.name}
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
                key={field.name}
                name={field.name}
                label={field.label}
                type={field.type as "text" | "tel" | "email"}
                value={formData[field.name as keyof typeof formData] || ""}
                required={field.required}
                placeholder={field.placeholder}
                onChange={handleChange}
              />
            ),
          )}

          <button
            type="submit"
            className={ownerModalStyles.form.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register Vehicle"}
          </button>
        </form>
      </div>
    </div>
  );
}
