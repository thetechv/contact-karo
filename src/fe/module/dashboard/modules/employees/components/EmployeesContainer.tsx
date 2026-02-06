"use client";

import { LoadingSpinner } from "@/fe/components/ui";
import { EmployeesHeader } from "./EmployeesHeader";
import { EmployeesTable } from "./EmployeesTable";
import { AddEmployeeModal } from "./AddEmployeeModal";
import { useEmployees, useEmployeeForm, useAuthCheck } from "../hooks";

export const EmployeesContainer = () => {
  const { employees, loading, error, loadEmployees } = useEmployees();
  const { router } = useAuthCheck(loadEmployees);
  const {
    formData,
    formErrors,
    submitting,
    showAddModal,
    setShowAddModal,
    handleAddEmployee,
    updateFormData,
  } = useEmployeeForm(loadEmployees);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <EmployeesHeader
          employeesCount={employees.length}
          onAddEmployee={() => setShowAddModal(true)}
          onBackToDashboard={() => router.push("/dashboard")}
        />

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <EmployeesTable employees={employees} />

        <AddEmployeeModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          formData={formData}
          formErrors={formErrors}
          submitting={submitting}
          onSubmit={handleAddEmployee}
          onFormDataChange={updateFormData}
        />
      </div>
    </main>
  );
};
