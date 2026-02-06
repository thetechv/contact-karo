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
  initialData?: OwnerFormData;
}

export function OwnerLoginModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: OwnerLoginModalProps) {
  const { formData, handleChange, handleSubmit } = useOwnerForm(
    onSubmit,
    initialData,
  );

  if (!isOpen) return null;

  const renderField = (field: (typeof ownerFormFields)[0]) => {
    let fieldElement: React.ReactNode;
    if (field.type === "textarea") {
      fieldElement = (
        <FormTextarea
          name={field.name}
          label={field.label}
          value={formData[field.name as keyof OwnerFormData]}
          required={field.required}
          placeholder={field.placeholder}
          rows={field.rows || 3}
          onChange={handleChange}
        />
      );
    } else if (field.type === "select") {
      const { FormSelect } = require("./FormSelect");
      fieldElement = (
        <FormSelect
          name={field.name}
          label={field.label}
          value={formData[field.name as keyof OwnerFormData] as string}
          required={field.required}
          placeholder={field.placeholder}
          options={field.options || []}
          onChange={handleChange as any}
        />
      );
    } else {
      fieldElement = (
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
    }

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
