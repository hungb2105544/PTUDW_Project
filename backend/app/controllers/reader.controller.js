const mongoose = require("mongoose");
const Reader = require("../models/Reader");
const ApiError = require("../api-error");
const bcrypt = require("bcrypt"); // Thêm bcrypt

exports.login = async (req, res, next) => {
  try {
    const { soDienThoai, password } = req.body; // Sử dụng mật khẩu thay vì ngày sinh
    if (!soDienThoai || !password) {
      return next(new ApiError(400, "Số điện thoại và mật khẩu là bắt buộc"));
    }

    const reader = await Reader.findOne({ soDienThoai });
    if (!reader) {
      return next(new ApiError(401, "Số điện thoại không tồn tại"));
    }

    // So sánh mật khẩu đã mã hóa
    const isMatch = await bcrypt.compare(password, reader.password);
    if (!isMatch) {
      return next(new ApiError(401, "Mật khẩu không đúng"));
    }

    return res.status(200).json({ message: "Đăng nhập thành công", reader });
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    return next(new ApiError(500, "Lỗi server nội bộ"));
  }
};

exports.register = async (req, res, next) => {
  const { hoLot, ten, ngaySinh, gioiTinh, diaChi, soDienThoai, password } =
    req.body;

  if (
    !hoLot ||
    !ten ||
    !ngaySinh ||
    !gioiTinh ||
    !diaChi ||
    !soDienThoai ||
    !password
  ) {
    return next(new ApiError(400, "Tất cả các trường là bắt buộc"));
  }

  try {
    const existingReader = await Reader.findOne({ soDienThoai });
    if (existingReader) {
      return next(new ApiError(400, "Số điện thoại đã được đăng ký"));
    }

    // Mã hóa mật khẩu trước khi lưu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newReader = await Reader.create({
      hoLot,
      ten,
      ngaySinh,
      gioiTinh,
      diaChi,
      soDienThoai,
      password: hashedPassword, // Lưu mật khẩu đã mã hóa
    });

    return res
      .status(201)
      .json({ message: "Đăng ký thành công", reader: newReader });
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    return next(new ApiError(500, "Lỗi server nội bộ"));
  }
};
