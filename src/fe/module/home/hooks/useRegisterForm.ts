import { useState } from "react";
import { VehicleOwner } from "../constants";

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

export function useRegisterForm(onSubmit: (data: VehicleOwner) => void) {
  const [formData, setFormData] = useState<VehicleOwner>(initialFormState);

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
