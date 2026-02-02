import { Service } from "../framework/service";
import dbConnect from "../lib/mongodb";
import QrTag from "../models/QrTag";
import QrBatch from "../models/QrBatch";
import User from "../models/User";
import mongoose from "mongoose";

class QrTagService extends Service {
  constructor() {
    super();
    dbConnect();
  }

  getId(req) {
    return req?.query?.id || req?.params?.id;
  }
  getQrId(req) {
    return req?.query?.qr_id || req?.params?.qr_id;
  }

  async createTag(req, res) {
    try {
      const { qr_id, batch_ref } = req.body || {};
      if (!qr_id || !batch_ref) {
        return res.status(400).json({ success: false, message: "qr_id and batch_ref are required" });
      }

      const exists = await QrTag.findOne({ qr_id }).lean();
      if (exists) return res.status(409).json({ success: false, message: "qr_id already exists" });

      const batch = await QrBatch.findById(batch_ref).lean();
      if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });

      const tag = await QrTag.create({ qr_id, batch_ref, status: "unassigned" });
      return res.status(201).json({ success: true, data: tag });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message || "Server error" });
    }
  }

  async getAllTags(req, res) {
    try {
      const { status, batch_ref, user_id } = req.query || {};
      const filter = {};
      if (status) filter.status = status;
      if (batch_ref) filter.batch_ref = batch_ref;
      if (user_id) filter.user_id = user_id;

      const tags = await QrTag.find(filter).populate("batch_ref").populate("user_id").sort({ createdAt: -1 }).lean();
      return res.status(200).json({ success: true, data: tags });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message || "Server error" });
    }
  }

  async getTagById(req, res) {
    try {
      const id = this.getId(req);
      if (!id) return res.status(400).json({ success: false, message: "id is required" });

      const tag = await QrTag.findById(id).populate("batch_ref").populate("user_id").lean();
      if (!tag) return res.status(404).json({ success: false, message: "Tag not found" });

      return res.status(200).json({ success: true, data: tag });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message || "Server error" });
    }
  }

  async getTagByQrId(req, res) {
    try {
      const qr_id = this.getQrId(req);
      if (!qr_id) return res.status(400).json({ success: false, message: "qr_id is required" });

      // Public scan response should be safe
      const tag = await QrTag.findOne({ qr_id }).lean();
      if (!tag) return res.status(404).json({ success: false, message: "QR not found" });

      if (tag.status !== "active" || !tag.user_id) {
        return res.status(200).json({ success: true, data: { qr_id, status: tag.status } });
      }

      const user = await User.findById(tag.user_id)
        .select("name phone whatsapp vehicle_no emergency_contact_1 emergency_contact_2 address blood_group allergies")
        .lean();

      return res.status(200).json({ success: true, data: { qr_id, status: tag.status, user } });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message || "Server error" });
    }
  }

  async updateTag(req, res) {
    try {
      const id = this.getId(req);
      const updates = req.body || {};
      if (!id) return res.status(400).json({ success: false, message: "id is required" });

      const tag = await QrTag.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).lean();
      if (!tag) return res.status(404).json({ success: false, message: "Tag not found" });

      return res.status(200).json({ success: true, data: tag });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message || "Server error" });
    }
  }

  async deleteTag(req, res) {
    try {
      const id = this.getId(req);
      if (!id) return res.status(400).json({ success: false, message: "id is required" });

      const tag = await QrTag.findByIdAndDelete(id).lean();
      if (!tag) return res.status(404).json({ success: false, message: "Tag not found" });

      return res.status(200).json({ success: true, message: "Tag deleted" });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message || "Server error" });
    }
  }

  // ✅ Activate QR = assign tag to user and link back user.qr_tag_id
  async activateQr(req, res) {
    const session = await mongoose.startSession();
    try {
      const { qr_id, user_id } = req.body || {};
      if (!qr_id || !user_id) {
        return res.status(400).json({ success: false, message: "qr_id and user_id are required" });
      }

      session.startTransaction();

      const tag = await QrTag.findOne({ qr_id }).session(session);
      if (!tag) {
        await session.abortTransaction();
        return res.status(404).json({ success: false, message: "QR not found" });
      }
      if (tag.status !== "unassigned" || tag.user_id) {
        await session.abortTransaction();
        return res.status(409).json({ success: false, message: "QR already assigned or not available" });
      }

      const user = await User.findById(user_id).session(session);
      if (!user) {
        await session.abortTransaction();
        return res.status(404).json({ success: false, message: "User not found" });
      }

      // enforce 1 user = 1 qr
      if (user.qr_tag_id) {
        await session.abortTransaction();
        return res.status(409).json({ success: false, message: "User already has a QR assigned" });
      }

      tag.user_id = user._id;
      tag.status = "active";
      await tag.save({ session });

      user.qr_tag_id = tag._id;
      await user.save({ session });

      await session.commitTransaction();
      return res.status(200).json({ success: true, data: { qr_id, user_id, tag_id: tag._id } });
    } catch (err) {
      try { await session.abortTransaction(); } catch (_) {}
      return res.status(500).json({ success: false, message: err?.message || "Server error" });
    } finally {
      session.endSession();
    }
  }
}

export default QrTagService;
