import mongoose from "mongoose";
const { Schema, model, models, Types } = mongoose;

const callSchema = new Schema({
    tagID: { type: Types.ObjectId, ref: "QrTag", required: true, index: true },
    callerPhone: { type: String, required: true },
    ownerPhone: { type: String, required: true },
    callSid: { type: String },
    status: { type: String, default: "initiated" },
}, { timestamps: true });


export default models.Call || model("Call", callSchema);