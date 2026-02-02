import { Schema, model, models, Types } from "mongoose";

const QrBatchSchema = new Schema(
  {
    batch_id: { type: String, required: true, unique: true, index: true }, // BATCH001
    qty: { type: Number, required: true, min: 1 }, // 100
    created_by: { type: Types.ObjectId, ref: "User", required: true },

    note: { type: String, trim: true },
  },
  { timestamps: true }
);

export default models.QrBatch || model("QrBatch", QrBatchSchema);
