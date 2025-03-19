const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  msNV: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  hoTen: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  chucVu: {
    type: String,
    required: true,
    enum: ["admin", "staff"],
  },
  diaChi: {
    type: String,
    required: true,
    trim: true,
  },
  soDienThoai: {
    type: String,
    required: true,
    match: /^0\d{9}$/,
  },
});

module.exports = mongoose.model("Employee", employeeSchema);
