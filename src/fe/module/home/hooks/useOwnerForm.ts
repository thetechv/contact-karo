import { useState } from "react";

export interface OwnerFormData {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  emergency_contact_1: string;
  emergency_contact_2: string;
  address: string;
}

const initialFormState: OwnerFormData = {
  name: "",
  phone: "",
  whatsapp: "",
  email: "",
  emergency_contact_1: "",
  emergency_contact_2: "",
  address: "",
};

export function useOwnerForm(onSubmit: (data: OwnerFormData) => void) {
  const [formData, setFormData] = useState<OwnerFormData>(initialFormState);

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
