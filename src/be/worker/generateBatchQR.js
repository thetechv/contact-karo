import QrTag from "../models/QrTag.js";

export const generateBatchQR = async (batchId, qty, type) => {
  for (let i = 0; i < qty; i++) {
    await QrTag.create({ batch_ref: batchId, type });
  }
};

export default async function (job) {
  const { batchId, qty, type } = job.data;
  await generateBatchQR(batchId, qty, type);
}