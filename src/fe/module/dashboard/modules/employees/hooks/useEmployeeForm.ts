"use client";

import { useState } from "react";
import { api } from "@/fe/services/api";
import type { EmployeeFormData, FormErrors } from "../constants";
import { initialEmployeeFormData } from "../constants";

export const useEmployeeForm = (onSuccess: () => void) => {
  const [formData, setFormData] = useState<EmployeeFormData>(
    initialEmployeeFormData,
  );
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.phone.trim() || formData.phone.length !== 10)
      errors.phone = "Valid 10-digit phone required";
    if (!formData.password || formData.password.length < 6)
      errors.password = "Password must be at least 6 characters";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setFormErrors({});

    const result = await api.createEmployee(formData);
    setSubmitting(false);

    if (result.success) {
      setShowAddModal(false);
      setFormData(initialEmployeeFormData);
      onSuccess();
      alert("Employee added successfully!");
    } else {
      setFormErrors({ submit: result.message || "Failed to add employee" });
    }
  };

  const updateFormData = (field: keyof EmployeeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    formErrors,
    submitting,
    showAddModal,
    setShowAddModal,
    handleAddEmployee,
    updateFormData,
  };
};
