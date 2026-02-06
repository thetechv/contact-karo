"use client";

import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";
import { BatchForm } from "./BatchForm";
import { BatchList } from "./BatchList";
import { EmployeesContainer } from "../modules/employees/components/EmployeesContainer";
import { TagsContainer } from "../modules/tags/components/TagsContainer";
import {
  useBatches,
  useBatchForm,
  useAuthCheck,
  useDashboardModule,
} from "../hooks";

export const DashboardContainer = () => {
  const { batches, isLoading, errorMessage, loadBatches, setErrorMessage } =
    useBatches();
  const {
    formState,
    isSubmitting,
    errorMessage: formErrorMessage,
    successMessage,
    canSubmit,
    handleChange,
    handleSubmit,
    setErrorMessage: setFormErrorMessage,
    setSuccessMessage,
  } = useBatchForm(loadBatches);
  const { handleLogout, router } = useAuthCheck(loadBatches);
  const { activeModule, setActiveModule } = useDashboardModule();

  const renderModuleContent = () => {
    switch (activeModule) {
      case "batches":
        return (
          <div className="flex flex-col gap-8">
            <BatchForm
              formState={formState}
              isSubmitting={isSubmitting}
              errorMessage={formErrorMessage}
              successMessage={successMessage}
              canSubmit={canSubmit}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
            <BatchList batches={batches} isLoading={isLoading} />
          </div>
        );
      case "employees":
        return <EmployeesContainer />;
      case "tags":
        return <TagsContainer />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar
        activeModule={activeModule}
        onModuleChange={setActiveModule}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
            <DashboardHeader router={router} handleLogout={handleLogout} />
            {renderModuleContent()}
          </div>
        </main>
      </div>
    </div>
  );
};
