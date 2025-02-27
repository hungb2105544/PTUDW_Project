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
    minlength: 6, // Tối thiểu 6 ký tự, trong thực tế nên mã hóa
  },
  chucVu: {
    type: String,
    required: true,
    enum: ["admin", "staff"], // Giới hạn giá trị hợp lệ
  },
  diaChi: {
    type: String,
    required: true,
    trim: true,
  },
  soDienThoai: {
    type: String,
    required: true,
    match: /^0\d{9}$/, // Định dạng số điện thoại Việt Nam (10 chữ số, bắt đầu bằng 0)
  },
});

module.exports = mongoose.model("Employee", employeeSchema);
