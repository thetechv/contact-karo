import jwt from "jsonwebtoken";
import User from "../models/User";
import dbConnect from "../lib/mongodb";

export async function userAuth(req, res, next) {
  try {
    await dbConnect();

    // Extract token from cookies
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Token not found. Please log in." });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded._id) {
      return res.status(401).json({ success: false, message: "Invalid token." });
    }

    // Validate required claims: _id, tagId, and ip
    if (!decoded.tagId || !decoded.ip) {
      return res.status(401).json({ success: false, message: "Token is missing required claims." });
    }

    // Get current request IP
    const currentIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.connection.remoteAddress || req.socket.remoteAddress;

    // Verify IP matches (prevent token usage from different device)
    if (decoded.ip !== currentIp) {
      return res.status(401).json({ success: false, message: "Token IP mismatch. Request from different device." });
    }

    // Verify user exists
    const user = await User.findById(decoded._id).lean();
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found." });
    }

    // Attach user and token info to request for downstream handlers
    req.user = decoded;
    next(req, res);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired. Please log in again." });
    }
    return res.status(401).json({ success: false, message: "Authentication failed." });
  }
}
