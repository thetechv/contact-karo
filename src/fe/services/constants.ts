// Home/Frontend shared types and constants
export interface ReasonOption {
  id: string;
  icon: string;
  label: string;
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
