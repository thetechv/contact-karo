import { useState } from "react";
import { api } from "@/fe/services/api";

// Types
export interface OwnerFormData {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  vehicle_no: string;
  vehicle_type: string;
  emergency_contact_1: string;
  emergency_contact_2: string;
  address: string;
}

const initialFormState: OwnerFormData = {
  name: "",
  phone: "",
  whatsapp: "",
  email: "",
  vehicle_no: "",
  vehicle_type: "",
  emergency_contact_1: "",
  emergency_contact_2: "",
  address: "",
};

// Owner form hook service
export function useOwnerForm(
  onSubmit: (data: OwnerFormData) => void,
  initialData?: OwnerFormData,
) {
  const [formData, setFormData] = useState<OwnerFormData>(
    initialData || initialFormState,
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(initialFormState);
  };

  const resetForm = () => {
    setFormData(initialFormState);
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    resetForm,
  };
}

// Owner form submission hook service
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
