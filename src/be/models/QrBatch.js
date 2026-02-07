import { Schema, model, models, Types } from "mongoose";

const batchType = [
  "car","bike","bag-tag","door-tag","business-card"
]

const QrBatchSchema = new Schema(
  {
    batch_id: { type: String, required: true, unique: true, index: true }, // BATCH001
    qty: { type: Number, required: true, min: 1 }, // 100
    //created_by: { type: Types.ObjectId, ref: "User", required: true },
    type:{type:String,enum:batchType,required:true},
    note: { type: String, trim: true },
    isTestBatch:{type:Boolean,default:false}, // false = real batch, true = testing batch
    status: { type: String, enum: ["new","generating","created", "in-printing", "distributed"], default: "created" },
  },
  { timestamps: true }
);

export default models.QrBatch || model("QrBatch", QrBatchSchema);
