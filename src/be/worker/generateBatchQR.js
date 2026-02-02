import QrTag from "../models/QrTag";

export const generateBatchQR = async (batchId, qty) => {
  for (let i = 0; i < qty; i++) {
    await QrTag.create({ batch_ref: batchId });
  }
};