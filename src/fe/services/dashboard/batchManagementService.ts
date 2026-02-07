"use client";

import { useState, useMemo, useCallback, type ChangeEvent, type FormEvent } from "react";

// Types
export interface Batch {
  _id: string;
  batch_id: string;
  qty: number;
  note?: string;
  created_at: string;
  status?: string;
}

export interface BatchFormState {
  name: string;
  qty: string;
  notes: string;
}

export const initialFormState: BatchFormState = {
  name: "",
  qty: "",
  notes: "",
};

// Batches hook service
export const useBatches = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadBatches = useCallback(async () => {
    try {
      setErrorMessage("");
      const response = await fetch("/api/v0/batch");
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "Unable to load batches.");
      }
      setBatches(payload?.data || []);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load batches.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    batches,
    isLoading,
    errorMessage,
    loadBatches,
    setErrorMessage,
  };
};

// Batch form hook service
export const useBatchForm = (onSuccess: () => Promise<void>) => {
  const [formState, setFormState] = useState<BatchFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const canSubmit = useMemo(() => {
    const qty = Number(formState.qty);
    return formState.name.trim().length > 0 && Number.isFinite(qty) && qty > 0;
  }, [formState]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await fetch("/api/v0/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batch_id: formState.name.trim(),
          qty: Number(formState.qty),
          note: formState.notes.trim(),
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "Failed to create batch.");
      }

      setSuccessMessage("Batch created. QR codes are generating now.");
      setFormState(initialFormState);
      await onSuccess();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create batch.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formState,
    isSubmitting,
    errorMessage,
    successMessage,
    canSubmit,
    handleChange,
    handleSubmit,
    setErrorMessage,
    setSuccessMessage,
  };
};
