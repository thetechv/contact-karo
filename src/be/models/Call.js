import mongoose from "mongoose";
const { Schema, model, models, Types } = mongoose;

const callSchema = new Schema({
    tagID: { type: Types.ObjectId, ref: "QrTag", required: true, index: true },
    phone: { type: String, required: true },

});


export default models.Call || model("Call", callSchema);