import { Service } from "../framework/service";
import dbConnect from "../lib/mongodb";
import Employee from "../models/Employee";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";


class EmployeeService extends Service {
  constructor() {
    super();
    dbConnect();
  }

  getId(req) {
    return req?.query?.id || req?.params?.id;
  }

  // CREATE EMPLOYEE
  async createEmployee(req, res) {
    try {
      const body = req.body || {};
      const requiredFields = ["name", "phone", "email", "password"];

      for (const field of requiredFields) {
        if (!body[field]) {
          return res
            .status(400)
            .json({ success: false, message: `${field} is required` });
        }
      }

      // Uniqueness checks
      const emailExists = await Employee.findOne({ email: body.email }).lean();
      if (emailExists)
        return res.status(409).json({ success: false, message: "Email already exists" });

      const phoneExists = await Employee.findOne({ phone: body.phone }).lean();
      if (phoneExists)
        return res.status(409).json({ success: false, message: "Phone already exists" });

      // Hash password
      const hashedPassword = await bcrypt.hash(body.password, 10);
      body.password = hashedPassword;

      const employee = await Employee.create(body);

      return res.status(201).json({
        success: true,
        data: {
          id: employee._id,
          name: employee.name,
          email: employee.email,
          phone: employee.phone,
          address: employee.address,
        },
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err?.message || "Server error",
      });
    }
  }

  // GET ALL EMPLOYEES
  async getAllEmployees(req, res) {
    try {
      const employees = await Employee.find({})
        .select("-password")
        .lean();

      return res.status(200).json({ success: true, data: employees });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err?.message || "Server error",
      });
    }
  }

  // GET EMPLOYEE BY ID
  async getEmployeeById(req, res) {
    try {
      console.log("Fetching employee with ID:");
      const { id } = req.query; 
      if (!id)
        return res.status(400).json({ success: false, message: "id is required" });
      console.log("Fetching employee with ID:", id);
      const employee = await Employee.findById(id)
        .select("-password")
        .lean();

      if (!employee)
        return res.status(404).json({ success: false, message: "Employee not found" });

      return res.status(200).json({ success: true, data: employee });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err?.message || "Server error",
      });
    }
  }

  // UPDATE EMPLOYEE
  async updateEmployee(req, res) {
    try {
      const id = this.getId(req);
      const updates = req.body || {};

      if (!id)
        return res.status(400).json({ success: false, message: "id is required" });

      // Prevent password update here (optional rule)
      delete updates.password;

      const employee = await Employee.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
        select: "-password",
      }).lean();

      if (!employee)
        return res.status(404).json({ success: false, message: "Employee not found" });

      return res.status(200).json({ success: true, data: employee });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err?.message || "Server error",
      });
    }
  }

  async loginEmployee(req, res) {
  const { email, password } = req.body || {};

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required",
      });
    }

    // password is select:false so explicitly include
    const employee = await Employee.findOne({ email: email.toLowerCase() })
      .select("+password")
      .lean();

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Invalid Credentials.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, employee.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ _id: employee._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie
    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax", // strict sometimes breaks local flows
        path: "/",
      })
    );

    // remove password before sending
    const { password: _, ...employeeData } = employee;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      employee: employeeData,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error: ${err.message}`,
    });
  }
}

async logoutEmployee(req, res) {
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

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}

}

export default EmployeeService;

