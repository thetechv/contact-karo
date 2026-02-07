"use client";

import { useState } from "react";
import type { Batch } from "../constants";

export const useBatches = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadBatches = async () => {
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
  };

  return {
    batches,
    isLoading,
    errorMessage,
    loadBatches,
    setErrorMessage,
  };
};
