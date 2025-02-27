const mongoose = require("mongoose");
const Reader = require("../models/Reader");
const ApiError = require("../api-error");

exports.login = async (req, res, next) => {
  try {
    const { soDienThoai, ngaySinh } = req.body; // Using phone and birthdate as credentials
    if (!soDienThoai || !ngaySinh) {
      return next(new ApiError(400, "Phone number and birthdate are required"));
    }

    const reader = await Reader.findOne({ soDienThoai, ngaySinh });
    if (!reader) {
      return next(new ApiError(401, "Invalid credentials"));
    }

    return res.status(200).json({ message: "Login successful", reader });
  } catch (error) {
    console.error("Error during login:", error);
    return next(new ApiError(500, "Internal Server Error"));
  }
};

exports.register = async (req, res, next) => {
  const { hoLot, ten, ngaySinh, gioiTinh, diaChi, soDienThoai } = req.body;

  if (!hoLot || !ten || !ngaySinh || !gioiTinh || !diaChi || !soDienThoai) {
    return next(new ApiError(400, "All fields are required"));
  }

  try {
    const existingReader = await Reader.findOne({ soDienThoai });
    if (existingReader) {
      return next(
        new ApiError(400, "Reader with this phone number already exists")
      );
    }

    const newReader = await Reader.create({
      hoLot,
      ten,
      ngaySinh,
      gioiTinh,
      diaChi,
      soDienThoai,
    });

    return res
      .status(201)
      .json({ message: "Registration successful", reader: newReader });
  } catch (error) {
    console.error("Error during registration:", error);
    return next(new ApiError(500, "Internal Server Error"));
  }
};
