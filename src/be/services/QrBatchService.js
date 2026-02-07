import { Service } from "../framework/service";
import dbConnect from "../lib/mongodb";
import QrBatch from "../models/QrBatch";
import { generateBatchQR } from "../worker/generateBatchQR";
import generateQRZip from "../worker/generateQRZip";

class QrBatchService extends Service {
  constructor() {
    super();
    dbConnect();
  }

  getId(req) {
    return req?.query?.id || req?.params?.id;
  }

  async createBatch(req, res) {
    try {
      const { batch_id, qty, created_by, note, type } = req.body || {};
      if (!batch_id || !qty) {
        return res.status(400).json({ success: false, message: "batch_id, qty, created_by are required" });
      }

      const exists = await QrBatch.findOne({ batch_id }).lean();
      if (exists) return res.status(409).json({ success: false, message: "batch_id already exists" });

      const batch = await QrBatch.create({ batch_id, qty, created_by, note, type });
      await generateBatchQR(batch._id, qty, type);
      return res.status(201).json({ success: true, data: batch });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message || "Server error" });
    }
  }

  async getAllBatches(req, res) {
    try {
      const batches = await QrBatch.find({}).sort({ createdAt: -1 }).lean();
      return res.status(200).json({ success: true, data: batches });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message || "Server error" });
    }
  }

  async getBatchById(req, res) {
    try {
      const id = this.getId(req);
      if (!id) return res.status(400).json({ success: false, message: "id is required" });

      const batch = await QrBatch.findById(id).lean();
      if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });

      return res.status(200).json({ success: true, data: batch });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message || "Server error" });
    }
  }

  async updateBatch(req, res) {
    try {
      const id = this.getId(req);
      const updates = req.body || {};
      if (!id) return res.status(400).json({ success: false, message: "id is required" });

      const batch = await QrBatch.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).lean();
      if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });

      return res.status(200).json({ success: true, data: batch });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message || "Server error" });
    }
  }

  async deleteBatch(req, res) {
    try {
      const id = this.getId(req);
      if (!id) return res.status(400).json({ success: false, message: "id is required" });

      const batch = await QrBatch.findByIdAndDelete(id).lean();
      if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });

      return res.status(200).json({ success: true, message: "Batch deleted" });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message || "Server error" });
    }
  }

  async downloadBatchQRZip(req, res) {
    try {
      const id = this.getId(req);
      if (!id) return res.status(400).json({ success: false, message: "id is required" });

      const batch = await QrBatch.findById(id).lean();
      if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });

      const zipBuffer = await generateQRZip(id);
      const filename = `qr-batch-${batch.batch_id || id}.zip`;

      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Content-Length", zipBuffer.length);
      return res.status(200).send(zipBuffer);
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message || "Server error" });
    }
  }
}

export default QrBatchService;
