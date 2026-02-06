import { useState } from "react";
import { api } from "@/fe/services/api";
import type { OwnerFormData } from "./useOwnerForm";

interface UseOwnerFormSubmissionProps {
  tagId: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function useOwnerFormSubmission({
  tagId,
  onSuccess,
  onError,
}: UseOwnerFormSubmissionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitOwnerForm = async (data: OwnerFormData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      console.log("Owner details submitted:", data);
      const response = await api.updateTag(tagId, data);

      if (response?.success) {
        onSuccess?.();
      } else {
        const errorMessage =
          response?.message || "Failed to update owner details";
        onError?.(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to update owner details";
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitOwnerForm,
    isSubmitting,
  };
}
