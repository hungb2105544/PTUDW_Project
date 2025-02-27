const mongoose = require("mongoose");

const borrowBookSchema = new mongoose.Schema({
  idDG: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Reader",
  },
  idSach: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Book",
  },
  ngayMuon: {
    type: Date,
    required: true,
  },
  trangThai: {
    type: String,
    required: true,
    enum: ["Borrowed", "Returned"],
  },
  ngayPhaiTra: {
    type: Date,
    required: true,
  },
  ngayTra: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("BorrowBook", borrowBookSchema);
