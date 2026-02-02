export interface FormFieldConfig {
  name: string;
  label: string;
  type: "text" | "tel" | "email" | "textarea";
  required: boolean;
  placeholder: string;
  rows?: number;
}

export const ownerFormFields: FormFieldConfig[] = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    required: true,
    placeholder: "Enter your full name",
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    required: true,
    placeholder: "9876543210",
  },
  {
    name: "whatsapp",
    label: "WhatsApp Number",
    type: "tel",
    required: true,
    placeholder: "9876543210",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    required: true,
    placeholder: "your.email@example.com",
  },
  {
    name: "emergency_contact_1",
    label: "Emergency Contact 1",
    type: "tel",
    required: true,
    placeholder: "9876543210",
  },
  {
    name: "emergency_contact_2",
    label: "Emergency Contact 2",
    type: "tel",
    required: false,
    placeholder: "9876543210 (Optional)",
  },
  {
    name: "address",
    label: "Address",
    type: "textarea",
    required: true,
    placeholder: "Enter your full address",
    rows: 2,
  },
];
