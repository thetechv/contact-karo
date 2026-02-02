"use client";

import React from "react";
import { useOwnerForm, type OwnerFormData } from "../hooks";
import { ownerFormFields } from "../constants";
import { ownerModalStyles } from "../styles/ownerModalStyles";
import { FormInput } from "./FormInput";
import { FormTextarea } from "./FormTextarea";
import { ModalHeader } from "./ModalHeader";

interface OwnerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OwnerFormData) => void;
}

export function OwnerLoginModal({
  isOpen,
  onClose,
  onSubmit,
}: OwnerLoginModalProps) {
  const { formData, handleChange, handleSubmit } = useOwnerForm(onSubmit);

  if (!isOpen) return null;

  return (
    <div className={ownerModalStyles.overlay}>
      <div className={ownerModalStyles.backdrop} onClick={onClose} />

      <div className={ownerModalStyles.modal}>
        <ModalHeader title="Update Owner Details" onClose={onClose} />

        <form
          onSubmit={handleSubmit}
          className={ownerModalStyles.form.container}
        >
          {ownerFormFields.map((field) =>
            field.type === "textarea" ? (
              <FormTextarea
                key={field.name}
                name={field.name}
                label={field.label}
                value={formData[field.name as keyof OwnerFormData]}
                required={field.required}
                placeholder={field.placeholder}
                rows={field.rows || 3}
                onChange={handleChange}
              />
            ) : (
              <FormInput
                key={field.name}
                name={field.name}
                label={field.label}
                type={field.type as "text" | "tel" | "email"}
                value={formData[field.name as keyof OwnerFormData]}
                required={field.required}
                placeholder={field.placeholder}
                onChange={handleChange}
              />
            ),
          )}

          <button type="submit" className={ownerModalStyles.form.submitButton}>
            Submit Details
          </button>
        </form>
      </div>
    </div>
  );
}
