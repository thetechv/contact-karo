import { Schema, model, models, Types } from "mongoose";

const QrTagSchema = new Schema(
  {
    
    type: { type: String, enum: ["vehicle", "personal"], required: false },

    // Only reference to batch
    batch_ref: { type: Types.ObjectId, ref: "QrBatch", required: true, index: true },

    // assignment (1 tag = 1 user)
    user_id: { type: Types.ObjectId, ref: "User", unique: true, sparse: true, index: true },

    status: { type: String, enum: ["unassigned", "active", "disabled"], default: "unassigned" },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.QrTag || model("QrTag", QrTagSchema);
