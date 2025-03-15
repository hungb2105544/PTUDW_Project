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
  password: {
    type: String,
    required: true,
    minlength: 6,
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
    match: /^0\d{9}$/, // Định dạng số điện thoại Việt Nam (10 chữ số, bắt đầu bằng 0)
  },
});

module.exports = mongoose.model("Reader", readerSchema);
