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

  const renderField = (field: (typeof ownerFormFields)[0]) => {
    const fieldElement =
      field.type === "textarea" ? (
        <FormTextarea
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
          name={field.name}
          label={field.label}
          type={field.type as "text" | "tel" | "email"}
          value={formData[field.name as keyof OwnerFormData]}
          required={field.required}
          placeholder={field.placeholder}
          onChange={handleChange}
        />
      );

    // Full-width fields
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
        <ModalHeader title="Update Owner Details" onClose={onClose} />

        <form
          onSubmit={handleSubmit}
          className={ownerModalStyles.form.container}
        >
          <div className={ownerModalStyles.form.grid}>
            {ownerFormFields.map(renderField)}
          </div>

          <button type="submit" className={ownerModalStyles.form.submitButton}>
            Submit Details ✓
          </button>
        </form>
      </div>
    </div>
  );
}
