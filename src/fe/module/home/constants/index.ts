export * from "./formFields";

export interface ReasonOption {
  id: string;
  icon: string;
  label: string;
}

export interface VehicleOwner {
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

export const reasonOptions: ReasonOption[] = [
  {
    id: "lights-on",
    icon: "☀️",
    label: "The lights of this car is on.",
  },
  {
    id: "no-parking",
    icon: "⚠️",
    label: "The car is in no parking.",
  },
  {
    id: "getting-towed",
    icon: "🚗",
    label: "The car is getting towed.",
  },
  {
    id: "window-open",
    icon: "🚪",
    label: "The window or car is open.",
  },
  {
    id: "something-wrong",
    icon: "⚠️",
    label: "Something wrong with this car.",
  },
];
