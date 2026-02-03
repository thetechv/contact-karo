import { useState } from "react";
import { VehicleOwner } from "../constants";
import tagService from "@/fe/services/tagService";

const initialFormState: VehicleOwner = {
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

export function useRegisterForm(
  tagId: string,
  onSuccess: () => void,
  onError: (error: string) => void,
) {
  const [formData, setFormData] = useState<VehicleOwner>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await tagService.activateTag(tagId, formData);

      if (response.success) {
        setFormData(initialFormState);
        onSuccess();
      } else {
        onError(response.message || "Failed to register vehicle");
      }
    } catch (error: any) {
      onError(error?.message || "An error occurred while registering");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    resetForm,
    isSubmitting,
  };
}
