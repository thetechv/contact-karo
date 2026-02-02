import React from "react";
import { ownerModalStyles } from "../styles/ownerModalStyles";

interface FormTextareaProps {
  name: string;
  label: string;
  value: string;
  required: boolean;
  placeholder: string;
  rows: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function FormTextarea({
  name,
  label,
  value,
  required,
  placeholder,
  rows,
  onChange,
}: FormTextareaProps) {
  return (
    <div className={ownerModalStyles.form.field}>
      <label className={ownerModalStyles.form.label}>
        {label}{" "}
        {required && <span className={ownerModalStyles.form.required}>*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className={ownerModalStyles.form.textarea}
        placeholder={placeholder}
      />
    </div>
  );
}
