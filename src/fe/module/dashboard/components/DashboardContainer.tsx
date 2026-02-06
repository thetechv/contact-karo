"use client";

import { DashboardHeader } from "./DashboardHeader";
import { BatchForm } from "./BatchForm";
import { BatchList } from "./BatchList";
import { useBatches, useBatchForm, useAuthCheck } from "../hooks";

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

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
      <DashboardHeader router={router} handleLogout={handleLogout} />
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
    </main>
  );
};
