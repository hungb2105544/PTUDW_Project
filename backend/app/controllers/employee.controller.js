const mongoose = require("mongoose");
const Employee = require("../models/Employee");
const ApiError = require("../api-error");

exports.login = async (req, res, next) => {
  try {
    const { msNV, password } = req.body;
    if (!msNV || !password) {
      return next(new ApiError(400, "Employee ID and password are required"));
    }

    const employee = await Employee.findOne({ msNV });
    if (!employee || employee.password !== password) {
      // Note: In production, use bcrypt
      return next(new ApiError(401, "Invalid credentials"));
    }

    return res.status(200).json({ message: "Login successful", employee });
  } catch (error) {
    console.error("Error during login:", error);
    return next(new ApiError(500, "Internal Server Error"));
  }
};

exports.register = async (req, res, next) => {
  const { msNV, hoTen, password, chucVu, diaChi, soDienThoai } = req.body;

  if (!msNV || !hoTen || !password || !chucVu || !diaChi || !soDienThoai) {
    return next(new ApiError(400, "All fields are required"));
  }

  try {
    const existingEmployee = await Employee.findOne({ msNV });
    if (existingEmployee) {
      return next(new ApiError(400, "Employee already exists"));
    }

    const newEmployee = await Employee.create({
      msNV,
      hoTen,
      password, // Note: In production, hash this with bcrypt
      chucVu,
      diaChi,
      soDienThoai,
    });

    return res
      .status(201)
      .json({ message: "Registration successful", employee: newEmployee });
  } catch (error) {
    console.error("Error during registration:", error);
    return next(new ApiError(500, "Internal Server Error"));
  }
};
