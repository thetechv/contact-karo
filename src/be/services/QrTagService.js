import { Service } from "../framework/service";
import dbConnect from "../lib/mongodb";
import QrTag from "../models/QrTag";
import QrBatch from "../models/QrBatch";
import User from "../models/User";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import twilio from "../lib/twilio";

class QrTagService extends Service {
  constructor() {
    super();
    // dbConnect() is now handled in methods to ensure connection state
  }

  getId(req) {
    return req?.query?.id || req?.params?.id;
  }
  getQrId(req) {
    return req?.query?.qr_id || req?.params?.qr_id;
  }

  async createTag(req, res) {
    try {
      await dbConnect();
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
      await dbConnect();
      const { status, batch_ref, user_id, page = 1, limit = 10 } = req.query || {};
      const filter = {};
      if (status) filter.status = status;
      if (batch_ref) filter.batch_ref = batch_ref;
      if (user_id) filter.user_id = user_id;

      const pageNum = Math.max(1, parseInt(page));
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      const total = await QrTag.countDocuments(filter);
      const tags = await QrTag.find(filter)
        .populate("batch_ref")
        .populate("user_id")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean();

      const stats = {
        total: await QrTag.countDocuments({}),
        active: await QrTag.countDocuments({ status: "active" }),
        unassigned: await QrTag.countDocuments({ status: "unassigned" }),
        disabled: await QrTag.countDocuments({ status: "disabled" }),
      };

      return res.status(200).json({
        success: true,
        data: tags,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
        stats,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message || "Server error" });
    }
  }

  async getTagById(req, res) {
    try {
      await dbConnect();
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
      await dbConnect();
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
      await dbConnect();
      const tagId = this.getId(req);
      const userId = req?.user?._id;
      const updates = req.body || {};

      if (!tagId) return res.status(400).json({ success: false, message: "tagId is required" });
      if (!userId) return res.status(401).json({ success: false, message: "User not authenticated" });

      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(tagId)) {
        return res.status(400).json({ success: false, message: "Invalid QR tag ID." });
      }

      // Verify tag ID matches token (single-tag bound token)
      if (req.user.tagId !== tagId) {
        return res.status(403).json({ success: false, message: "Token is for a different tag" });
      }

      // Get tag
      const tag = await QrTag.findById(tagId).lean();
      if (!tag) return res.status(404).json({ success: false, message: "Tag not found" });

      // Verify tag belongs to authenticated user
      if (tag.user_id.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: "Unauthorized: Tag does not belong to the authenticated user" });
      }

      // Update user details (not tag)
      const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).lean();
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      // Clear the OTP verification cookie
      res.setHeader(
        "Set-Cookie",
        serialize("token", "", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          expires: new Date(0),
          sameSite: "lax",
          path: "/",
        })
      );

      return res.status(200).json({ success: true, message: "User details updated successfully", data: user });
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

  // Generate and send OTP for updating tag details.
  async generateOtpToUpdateTag(req, res) {
    try {
      await dbConnect();
      const tagId = this.getId(req);
      const phone = req?.body?.phone;

      if (!tagId || !phone) {
        return res.status(400).json({ success: false, message: "tagId and phone are required" });
      }

      if (!mongoose.Types.ObjectId.isValid(tagId)) {
        return res.status(400).json({ success: false, message: "Invalid QR tag ID." });
      }

      const tag = await QrTag.findById(tagId).lean();
      if (!tag) return res.status(404).json({ success: false, message: "Tag not found" });

      if (!tag.user_id) {
        return res.status(400).json({ success: false, message: "Tag is not assigned to any user" });
      }

      const user = await User.findById(tag.user_id).select("phone").lean();
      if (!user) return res.status(404).json({ success: false, message: "Assigned user not found" });

      // Only allow if provided phone matches the phone of the assigned user
      if ((user.phone || "").toString() !== phone.toString()) {
        return res.status(403).json({ success: false, message: "Phone does not match assigned user" });
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
      console.log(`Generated update-OTP for tag ${tagId}: ${otp}`);

      // Send OTP via Twilio
      await twilio.sendMessage(phone, `Your OTP for updating tag details is ${otp}`);

      return res.status(200).json({ success: true, message: "OTP sent successfully" });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message || "Server error" });
    }
  }

  //verify OTP for updating tag details
  async verifyOtp(req, res) {
    try {
      await dbConnect();
      const tagId = this.getId(req);
      const { otp, phone } = req.body || {};

      if (!tagId || !otp) {
        return res.status(400).json({ success: false, message: "tagId and otp are required" });
      }

      if (!mongoose.Types.ObjectId.isValid(tagId)) {
        return res.status(400).json({ success: false, message: "Invalid QR tag ID." });
      }

      const tag = await QrTag.findById(tagId).lean();
      if (!tag) return res.status(404).json({ success: false, message: "Tag not found" });

      if (!tag.user_id) return res.status(400).json({ success: false, message: "Tag is not assigned to any user" });

      // Ensure OTP was generated
      if (!tag.otp?.code) return res.status(400).json({ success: false, message: "OTP not sent for this tag" });

      // Optionally verify phone matches saved OTP phone
      const otpPhone = tag.otp?.phone;
      if (otpPhone && phone && otpPhone.toString() !== phone.toString()) {
        return res.status(403).json({ success: false, message: "Phone does not match OTP phone" });
      }

      // Check expiry
      if (new Date() > new Date(tag.otp.expires_at)) return res.status(400).json({ success: false, message: "OTP has expired" });

      // Check attempts limit
      if (typeof tag.otp.attempts === "number" && tag.otp.attempts >= 5) {
        return res.status(429).json({ success: false, message: "Too many OTP attempts" });
      }

      // Match OTP
      if (tag.otp.code !== otp.toString()) {
        // increment attempts
        await QrTag.findByIdAndUpdate(tagId, { $inc: { "otp.attempts": 1 }, "otp.last_attempt_at": new Date() }, { new: true });
        return res.status(400).json({ success: false, message: "Invalid OTP" });
      }

      // OTP valid — fetch user
      const user = await User.findById(tag.user_id).lean();
      if (!user) return res.status(404).json({ success: false, message: "Assigned user not found" });

      // Clear OTP
      await QrTag.findByIdAndUpdate(tagId, { otp: {} }, { new: true });

      // Get client IP
      const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.connection.remoteAddress || req.socket.remoteAddress;

      // Issue JWT token with tagId, userId, and IP
      const token = jwt.sign(
        { _id: user._id, tagId: tagId, ip: clientIp },
        process.env.JWT_SECRET,
        { expiresIn: "7m" }
      );

      res.setHeader(
        "Set-Cookie",
        serialize("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 60,
          sameSite: "lax",
          path: "/",
        })
      );

      // Return user details (lean already has no methods)
      return res.status(200).json({ success: true, message: "OTP verified", user });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message || "Server error" });
    }
  }

  // ✅ Generate and send OTP for tag
  async generateOtp(req, res) {
    try {
      await dbConnect();
      const tagId = this.getId(req);
      const phone = req?.body?.phone;

      if (!tagId || !phone) {
        return res.status(400).json({ success: false, message: "tagId and phone are required" });
      }
      console.log("checking...", tagId, phone);
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
    await dbConnect();
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
      try { await session.abortTransaction(); } catch { }
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
      const contactNumber = user.whatsapp || user.phone;
      const cleanNumber = contactNumber.toString().replace(/\D/g, "").slice(-10); // get last 10 digits to be safe against +91 prefix
      console.log(cleanNumber);
      await twilio.sendWhatsappMessage(cleanNumber, user.name, user.vehicle_no, violation);
      return res.status(200).json({ success: true, message: "Message sent successfully" });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message || "Server error" });
    }
  }
}

export default QrTagService;
