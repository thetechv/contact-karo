import jwt from "jsonwebtoken";
import Employee from "../models/Employee";
import dbConnect from "../lib/mongodb";

export async function loginAuth(req, res, next) {
  try {
    await dbConnect();

    // 1) token from cookie
    let token = req.cookies?.token;

    // 2) or token from Authorization header: Bearer <token>
    if (!token && req.headers?.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employeeId = decoded?._id;

    if (!employeeId) {
      return res.status(401).json({ success: false, message: "Unauthorized: invalid token" });
    }

    const employee = await Employee.findById(employeeId).select("-password");
    if (!employee) {
      return res.status(401).json({ success: false, message: "Unauthorized: user not found" });
    }

    req.employee = employee;
    next(req, res);
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: " + (err?.message || "Auth error"),
    });
  }
}
