"use client";

import { useState } from "react";
import { api } from "@/fe/services/api";
import type { Employee } from "../constants";

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEmployees = async () => {
    setLoading(true);
    const result = await api.getAllEmployees();
    if (result.success && result.data) {
      setEmployees(result.data as Employee[]);
    } else {
      setError(result.message || "Failed to load employees");
    }
    setLoading(false);
  };

  return {
    employees,
    loading,
    error,
    loadEmployees,
    setError,
  };
};
