import * as Yup from "yup";

// Common validation patterns
export const VALIDATION_PATTERNS = {
  phoneRegex: /^[6-9]\d{9}$/,
  vehicleNumberRegex: /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$/,
  emailRegex: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
};

// Common validation messages
export const VALIDATION_MESSAGES = {
  required: (field: string) => `${field} is required`,
  email: "Please enter a valid email address",
  phone: "Please enter a valid 10-digit phone number starting with 6-9",
  vehicleNumber: "Please enter a valid vehicle number (e.g., DL01AB1234)",
  minLength: (field: string, min: number) =>
    `${field} must be at least ${min} characters`,
  maxLength: (field: string, max: number) =>
    `${field} cannot exceed ${max} characters`,
  positiveNumber: "Please enter a positive number",
  min: (field: string, min: number) => `${field} must be at least ${min}`,
  max: (field: string, max: number) => `${field} cannot exceed ${max}`,
};

// Login Form Schema
export const loginFormSchema = Yup.object({
  email: Yup.string()
    .matches(VALIDATION_PATTERNS.emailRegex, VALIDATION_MESSAGES.email)
    .required(VALIDATION_MESSAGES.required("Email")),
  password: Yup.string()
    .min(6, VALIDATION_MESSAGES.minLength("Password", 6))
    .required(VALIDATION_MESSAGES.required("Password")),
});

// Batch Form Schema
export const batchFormSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, VALIDATION_MESSAGES.minLength("Batch name", 2))
    .max(50, VALIDATION_MESSAGES.maxLength("Batch name", 50))
    .required(VALIDATION_MESSAGES.required("Batch name")),
  qty: Yup.number()
    .typeError("Quantity must be a number")
    .positive(VALIDATION_MESSAGES.positiveNumber)
    .integer("Quantity must be a whole number")
    .min(1, VALIDATION_MESSAGES.min("Quantity", 1))
    .max(10000, VALIDATION_MESSAGES.max("Quantity", 10000))
    .required(VALIDATION_MESSAGES.required("Quantity")),
  notes: Yup.string()
    .max(500, VALIDATION_MESSAGES.maxLength("Notes", 500))
    .optional(),
});

// Vehicle Registration Schema
export const vehicleRegistrationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, VALIDATION_MESSAGES.minLength("Name", 2))
    .max(100, VALIDATION_MESSAGES.maxLength("Name", 100))
    .required(VALIDATION_MESSAGES.required("Full name")),
  phone: Yup.string()
    .matches(VALIDATION_PATTERNS.phoneRegex, VALIDATION_MESSAGES.phone)
    .required(VALIDATION_MESSAGES.required("Phone number")),
  whatsapp: Yup.string()
    .matches(VALIDATION_PATTERNS.phoneRegex, VALIDATION_MESSAGES.phone)
    .required(VALIDATION_MESSAGES.required("WhatsApp number")),
  email: Yup.string()
    .matches(VALIDATION_PATTERNS.emailRegex, VALIDATION_MESSAGES.email)
    .required(VALIDATION_MESSAGES.required("Email")),
  vehicle_no: Yup.string()
    .trim()
    .uppercase()
    .matches(
      VALIDATION_PATTERNS.vehicleNumberRegex,
      VALIDATION_MESSAGES.vehicleNumber,
    )
    .required(VALIDATION_MESSAGES.required("Vehicle number")),
  vehicle_type: Yup.string()
    .oneOf(
      ["car", "bike", "scooter", "other"],
      "Please select a valid vehicle type",
    )
    .required(VALIDATION_MESSAGES.required("Vehicle type")),
  emergency_contact_1: Yup.string()
    .matches(VALIDATION_PATTERNS.phoneRegex, VALIDATION_MESSAGES.phone)
    .required(VALIDATION_MESSAGES.required("Emergency contact 1")),
  emergency_contact_2: Yup.string()
    .matches(VALIDATION_PATTERNS.phoneRegex, VALIDATION_MESSAGES.phone)
    .optional(),
  address: Yup.string()
    .max(500, VALIDATION_MESSAGES.maxLength("Address", 500))
    .optional(),
});

// Owner Form Schema
export const ownerFormSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, VALIDATION_MESSAGES.minLength("Name", 2))
    .max(100, VALIDATION_MESSAGES.maxLength("Name", 100))
    .required(VALIDATION_MESSAGES.required("Full name")),
  phone: Yup.string()
    .matches(VALIDATION_PATTERNS.phoneRegex, VALIDATION_MESSAGES.phone)
    .required(VALIDATION_MESSAGES.required("Phone number")),
  whatsapp: Yup.string()
    .matches(VALIDATION_PATTERNS.phoneRegex, VALIDATION_MESSAGES.phone)
    .optional(),
  email: Yup.string()
    .matches(VALIDATION_PATTERNS.emailRegex, VALIDATION_MESSAGES.email)
    .required(VALIDATION_MESSAGES.required("Email")),
  vehicle_no: Yup.string()
    .trim()
    .uppercase()
    .matches(
      VALIDATION_PATTERNS.vehicleNumberRegex,
      VALIDATION_MESSAGES.vehicleNumber,
    )
    .required(VALIDATION_MESSAGES.required("Vehicle number")),
  vehicle_type: Yup.string()
    .oneOf(
      ["car", "bike", "scooter", "other"],
      "Please select a valid vehicle type",
    )
    .optional(),
  emergency_contact_1: Yup.string()
    .matches(VALIDATION_PATTERNS.phoneRegex, VALIDATION_MESSAGES.phone)
    .required(VALIDATION_MESSAGES.required("Emergency contact 1")),
  emergency_contact_2: Yup.string()
    .matches(VALIDATION_PATTERNS.phoneRegex, VALIDATION_MESSAGES.phone)
    .optional(),
  address: Yup.string()
    .max(500, VALIDATION_MESSAGES.maxLength("Address", 500))
    .optional(),
});

// Message Form Schema
export const messageFormSchema = Yup.object({
  reasonId: Yup.string().required(VALIDATION_MESSAGES.required("Reason")),
  additionalMessage: Yup.string()
    .max(500, VALIDATION_MESSAGES.maxLength("Additional message", 500))
    .optional(),
  phoneNumber: Yup.string()
    .matches(VALIDATION_PATTERNS.phoneRegex, VALIDATION_MESSAGES.phone)
    .optional(),
});

// Form data types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface BatchFormData {
  name: string;
  qty: number;
  notes: string;
}

export interface VehicleRegistrationFormData {
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

export interface MessageFormData {
  reasonId: string;
  additionalMessage: string;
  phoneNumber: string;
}
