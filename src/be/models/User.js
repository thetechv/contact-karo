import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Owner details
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      index: true,
    },

    whatsapp: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },

    // Vehicle details (1 user = 1 vehicle)
    vehicle_no: {
      type: String,
      required: [true, "Vehicle number is required"],
      uppercase: true,
      trim: true,
      index: true,
    },

    vehicle_type: {
      type: String,
      enum: ["car", "bike", "scooter", "other"],
      default: "car",
    },

    // Emergency contacts
    emergency_contact_1: {
      type: String,
      required: [true, "Emergency contact 1 is required"],
      trim: true,
    },

    emergency_contact_2: {
      type: String,
      trim: true,
    },

    // Address
    address: {
      type: String,
      trim: true,
      maxlength: 250,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
