"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/fe/services/api";
import useQuery from "@/fe/services/useQuery";

// Types
export interface Employee {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  createdAt: string;
}

export interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
}

export type FormErrors = Record<string, string>;

export const initialEmployeeFormData: EmployeeFormData = {
  name: "",
  email: "",
  phone: "",
  password: "",
  address: "",
};

// Employee list hook service
export const useEmployees = () => {
  const router = useRouter();

  const getAllEmployeesWithAuth = useCallback(async () => {
    const result = await api.getAllEmployees();
    // Handle auth failure
    if (!result.success && result.message?.includes("401")) {
      router.push("/login");
      throw new Error("Unauthorized");
    }
    return result;
  }, [router]);

  const { data, isLoading, error, refetch } = useQuery(
    getAllEmployeesWithAuth,
    {},
    "employees-list",
  );

  return {
    employees: (data?.success ? data.data : []) || [],
    loading: isLoading,
    error: error ? String(error) : null,
    loadEmployees: refetch,
  };
};

// Employee form hook service
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
