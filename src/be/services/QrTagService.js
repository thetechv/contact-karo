import { Service } from "../framework/service";
import dbConnect from "../lib/mongodb";
import QrTag from "../models/QrTag";
import QrBatch from "../models/QrBatch";
import User from "../models/User";
import mongoose from "mongoose";
import twilio from "../lib/twilio";

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

  // ✅ Generate and send OTP for tag
  async generateOtp(req, res) {
    try {
      const tagId = this.getId(req);
      const phone = req?.body?.phone;

      if (!tagId || !phone) {
        return res.status(400).json({ success: false, message: "tagId and phone are required" });
      }

      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(tagId)) {
        return res.status(400).json({ success: false, message: "Invalid QR tag ID." });
      }

      // Check if tag exists
      const tag = await QrTag.findById(tagId).lean();
      if (!tag) {
        return res.status(404).json({ success: false, message: "Tag not found" });
      }

      // Rate limiting: Check if OTP was sent recently (2 minutes cooldown)
      if (tag.otp?.last_attempt_at) {
        const timeSinceLastAttempt = Date.now() - new Date(tag.otp.last_attempt_at).getTime();
        const twoMinutesInMs = 2 * 60 * 1000;

        if (timeSinceLastAttempt < twoMinutesInMs) {
          const remainingMs = twoMinutesInMs - timeSinceLastAttempt;
          const remainingMinutes = Math.floor(remainingMs / 60000);
          const remainingSeconds = Math.ceil((remainingMs % 60000) / 1000);
          return res.status(429).json({ success: false, message: `Please wait ${remainingMinutes}m ${remainingSeconds}s before requesting a new OTP` });
        }
      }

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000);

      // Save OTP to tag with expiry (5 minutes)
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
      await QrTag.findByIdAndUpdate(
        tagId,
        {
          "otp.code": otp.toString(),
          "otp.expires_at": expiresAt,
          "otp.attempts": 0,
          "otp.last_attempt_at": new Date(),
          "otp.phone": phone,
        },
        { new: true }
      );
      console.log(`Generated OTP for tag ${tagId}: ${otp}`);

      // Send OTP via Twilio
      await twilio.sendMessage(phone, `Your OTP is ${otp}`);

      return res.status(200).json({ success: true, message: "OTP sent successfully" });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message || "Server error" });
    }
  }

  // ✅ Activate QR = assign tag to user and link back user.qr_tag_id
  async activateQr(req, res) {
    const session = await mongoose.startSession();
    try {
      const tagId = this.getId(req);
      let {
        otp,
        name,
        phone,
        whatsapp,
        email,
        vehicle_no,
        vehicle_type,
        emergency_contact_1,
        emergency_contact_2,
        address,
      } = req.body || {};
      
      if (!tagId) {
        return res.status(400).json({ success: false, message: "tag id is required" });
      }

      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(tagId)) {
        return res.status(400).json({ success: false, message: "Invalid QR tag ID." });
      }

      if (!otp) {
        return res.status(400).json({ success: false, message: "otp is required" });
      }

      await User.createCollection();
      session.startTransaction();

      const tag = await QrTag.findById(tagId).session(session);
      if (!tag) {
        await session.abortTransaction();
        return res.status(404).json({ success: false, message: "QR not found" });
      }
      console.log("Tag found:", tag);
      // If phone not provided during activation, use the phone saved with the OTP
      if (!phone) phone = tag.otp?.phone;

      if (!name || !phone || !email || !vehicle_no || !emergency_contact_1) {
        await session.abortTransaction();
        return res.status(400).json({ success: false, message: "name, phone, email, vehicle_no, emergency_contact_1 are required" });
      }
      // Check if OTP exists
      if (!tag.otp?.code) {
        await session.abortTransaction();
        return res.status(400).json({ success: false, message: "OTP not sent for this tag" });
      }

      // Check if OTP is expired
      if (new Date() > new Date(tag.otp.expires_at)) {
        await session.abortTransaction();
        return res.status(400).json({ success: false, message: "OTP has expired" });
      }

      // Check if OTP matches
      if (tag.otp.code !== otp.toString()) {
        await session.abortTransaction();
        return res.status(400).json({ success: false, message: "Invalid OTP" });
      }

      if (tag.status !== "unassigned" || tag.user_id) {
        await session.abortTransaction();
        return res.status(409).json({ success: false, message: "QR already assigned or not available" });
      }

      const [user] = await User.create(
        [
          {
            name,
            phone,
            whatsapp,
            email,
            vehicle_no,
            vehicle_type,
            emergency_contact_1,
            emergency_contact_2,
            address,
          },
        ],
        { session }
      );

      tag.user_id = user._id;
      tag.status = "active";
      tag.otp = {}; // Clear OTP after successful activation
      await tag.save({ session });

      user.qr_tag_id = tag._id;
      await user.save({ session });

      await session.commitTransaction();
      await twilio.sendWhatsappMessage(phone, name, vehicle_no, "Registration");
      return res.status(200).json({ success: true, data: { tag_id: tag._id, user_id: user._id } });
    } catch (err) {
      try { await session.abortTransaction(); } catch {}
      return res.status(500).json({ success: false, message: err?.message || "Server error" });
    } finally {
      session.endSession();
    }
  }

  async sendMessage(req, res) {
    try {
      const tagId = this.getId(req);
      const { violation } = req.body || {};
      const tag = await QrTag.findById(tagId).lean();
      if (!tag) {
        return res.status(404).json({ success: false, message: "Tag not found" });
      }

      if (tag.status !== "active" || !tag.user_id) {
        return res.status(400).json({ success: false, message: "Tag is not active or not assigned" });
      }
      const user = await User.findById(tag.user_id).lean();
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      await twilio.sendWhatsappMessage(user.phone, user.name, user.vehicle_no, violation);
      return res.status(200).json({ success: true, message: "Message sent successfully" });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message || "Server error" });
    }
  }
}

export default QrTagService;
