"use client";

import React from "react";
import { ownerModalStyles } from "../styles/ownerModalStyles";

interface FormSelectProps {
  name: string;
  label: string;
  value: string;
  required: boolean;
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function FormSelect({
  name,
  label,
  value,
  required,
  placeholder,
  options,
  onChange,
}: FormSelectProps) {
  return (
    <div className={ownerModalStyles.form.field}>
      <label htmlFor={name} className={ownerModalStyles.form.label}>
        {label}{" "}
        {required && <span className={ownerModalStyles.form.required}>*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={ownerModalStyles.form.input}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
