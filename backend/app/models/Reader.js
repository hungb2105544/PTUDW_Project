const mongoose = require("mongoose");

const readerSchema = new mongoose.Schema({
  hoLot: {
    type: String,
    required: true,
    trim: true,
  },
  ten: {
    type: String,
    required: true,
    trim: true,
  },
  ngaySinh: {
    type: Date,
    required: true,
  },
  gioiTinh: {
    type: String,
    required: true,
    enum: ["Nam", "Nu"],
  },
  diaChi: {
    type: String,
    required: true,
    trim: true,
  },
  soDienThoai: {
    type: String,
    required: true,
    unique: true,
    match: /^0\d{9}$/,
  },
});

module.exports = mongoose.model("Reader", readerSchema);
