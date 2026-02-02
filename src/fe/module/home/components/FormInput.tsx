import React from "react";
import { ownerModalStyles } from "../styles/ownerModalStyles";

interface FormInputProps {
  name: string;
  label: string;
  type: "text" | "tel" | "email";
  value: string;
  required: boolean;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FormInput({
  name,
  label,
  type,
  value,
  required,
  placeholder,
  onChange,
}: FormInputProps) {
  return (
    <div className={ownerModalStyles.form.field}>
      <label className={ownerModalStyles.form.label}>
        {label}{" "}
        {required && <span className={ownerModalStyles.form.required}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={ownerModalStyles.form.input}
        placeholder={placeholder}
      />
    </div>
  );
}
