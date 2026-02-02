"use client";

import React from "react";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { registerFormFields, type VehicleOwner } from "../constants";
import { ownerModalStyles } from "../styles/ownerModalStyles";
import { FormInput } from "./FormInput";
import { FormTextarea } from "./FormTextarea";
import { ModalHeader } from "./ModalHeader";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VehicleOwner) => void;
}

export function RegisterModal({
  isOpen,
  onClose,
  onSubmit,
}: RegisterModalProps) {
  const { formData, handleChange, handleSubmit } = useRegisterForm(onSubmit);

  if (!isOpen) return null;

  return (
    <div className={ownerModalStyles.overlay}>
      <div className={ownerModalStyles.backdrop} onClick={onClose} />

      <div className={ownerModalStyles.modal}>
        <ModalHeader title="Register Your Vehicle" onClose={onClose} />

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
                value={formData[field.name as keyof VehicleOwner] || ""}
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
                value={formData[field.name as keyof VehicleOwner] || ""}
                required={field.required}
                placeholder={field.placeholder}
                onChange={handleChange}
              />
            ),
          )}

          <button type="submit" className={ownerModalStyles.form.submitButton}>
            Register Vehicle
          </button>
        </form>
      </div>
    </div>
  );
}
