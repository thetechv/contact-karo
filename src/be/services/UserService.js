import { Service } from "../framework/service";
import dbConnect from "../lib/mongodb";
import User from "../models/User";

class UserService extends Service {
  constructor() {
    super();
    dbConnect();
  }

  getId(req) {
    return req?.query?.id || req?.params?.id;
  }

  async createUser(req, res) {
    try {
      const body = req.body || {};
      const requiredFields = ["name", "phone", "email", "vehicle_no", "emergency_contact_1"];

      for (const f of requiredFields) {
        if (!body[f]) {
          return res.status(400).json({ success: false, message: `${f} is required` });
        }
      }

      // uniqueness checks
      const existingEmail = await User.findOne({ email: body.email }).lean();
      if (existingEmail) return res.status(409).json({ success: false, message: "Email already exists" });

      const existingPhone = await User.findOne({ phone: body.phone }).lean();
      if (existingPhone) return res.status(409).json({ success: false, message: "Phone already exists" });

      const existingVehicle = await User.findOne({ vehicle_no: body.vehicle_no?.toUpperCase() }).lean();
      if (existingVehicle) return res.status(409).json({ success: false, message: "Vehicle already exists" });

      body.vehicle_no = body.vehicle_no.toUpperCase();

      const user = await User.create(body);
      return res.status(201).json({ success: true, data: user });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message || "Server error" });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await User.find({}).lean();
      return res.status(200).json({ success: true, data: users });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message || "Server error" });
    }
  }

  async getUserById(req, res) {
    try {
      const id = this.getId(req);
      if (!id) return res.status(400).json({ success: false, message: "id is required" });

      const user = await User.findById(id).populate("qr_tag_id").lean();
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      return res.status(200).json({ success: true, data: user });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message || "Server error" });
    }
  }

  async updateUserDetails(req, res) {
    try {
      const id = this.getId(req);
      const updates = req.body || {};
      if (!id) return res.status(400).json({ success: false, message: "id is required" });

      if (updates.vehicle_no) updates.vehicle_no = updates.vehicle_no.toUpperCase();

      const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).lean();
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      return res.status(200).json({ success: true, data: user });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message || "Server error" });
    }
  }

  async deleteUser(req, res) {
    try {
      const id = this.getId(req);
      if (!id) return res.status(400).json({ success: false, message: "id is required" });

      const user = await User.findByIdAndDelete(id).lean();
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      return res.status(200).json({ success: true, message: "User deleted" });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message || "Server error" });
    }
  }
}

export default UserService;
