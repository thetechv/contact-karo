// Home/Frontend shared types and constants
export interface ReasonOption {
  id: string;
  icon: string;
  label: string;
}

export const carReasonOptions: ReasonOption[] = [
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

export const bikeReasonOptions: ReasonOption[] = [
  {
    id: "lights-on",
    icon: "☀️",
    label: "The lights of this bike is on.",
  },
  {
    id: "no-parking",
    icon: "⚠️",
    label: "The bike is in no parking.",
  },
  {
    id: "getting-towed",
    icon: "🛵",
    label: "The bike is getting towed.",
  },
  {
    id: "key-in-ignition",
    icon: "🔑",
    label: "Key is left in the bike.",
  },
  {
    id: "something-wrong",
    icon: "⚠️",
    label: "Something wrong with this bike.",
  },
];

export const otherReasonOptions: ReasonOption[] = [
  {
    id: "lights-on",
    icon: "☀️",
    label: "The lights are on.",
  },
  {
    id: "no-parking",
    icon: "⚠️",
    label: "The vehicle is in no parking.",
  },
  {
    id: "getting-towed",
    icon: "🚗",
    label: "The vehicle is getting towed.",
  },
  {
    id: "unsecured",
    icon: "🔓",
    label: "The vehicle is unsecured.",
  },
  {
    id: "something-wrong",
    icon: "⚠️",
    label: "Something wrong with this vehicle.",
  },
];

// ... (previous code)

export const bagTagReasonOptions: ReasonOption[] = [
  {
    id: "found-bag",
    icon: "🎒",
    label: "I found this bag.",
  },
  {
    id: "bag-open",
    icon: "🔓",
    label: "The bag is open or unsecured.",
  },
  {
    id: "something-wrong",
    icon: "⚠️",
    label: "Something wrong with this bag.",
  },
];

export const doorTagReasonOptions: ReasonOption[] = [
  {
    id: "visitor",
    icon: "👋",
    label: "I am at the door / Visitor.",
  },
  {
    id: "delivery",
    icon: "📦",
    label: "Package delivered / Delivery.",
  },
  {
    id: "emergency",
    icon: "🚨",
    label: "Emergency / Critical Issue.",
  },
  {
    id: "something-wrong",
    icon: "⚠️",
    label: "Something wrong at the door.",
  },
];

export const businessCardReasonOptions: ReasonOption[] = [
  {
    id: "inquiry",
    icon: "💼",
    label: "New Inquiry / Business Proposal.",
  },
  {
    id: "meeting",
    icon: "📅",
    label: "Schedule a meeting.",
  },
  {
    id: "contact",
    icon: "📞",
    label: "General Contact.",
  },
  {
    id: "other",
    icon: "✨",
    label: "Other reason.",
  },
];

export const getReasonOptions = (vehicleType: string = "car"): ReasonOption[] => {
  const type = vehicleType.toLowerCase();

  if (type === "bike" || type === "scooter" || type === "motorcycle") {
    return bikeReasonOptions;
  }
  if (type === "car") {
    return carReasonOptions;
  }
  if (type === "bag-tag") {
    return bagTagReasonOptions;
  }
  if (type === "door-tag") {
    return doorTagReasonOptions;
  }
  if (type === "business-card") {
    return businessCardReasonOptions;
  }

  return otherReasonOptions;
};
export const reasonOptions = carReasonOptions;
