const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  tenSach: {
    type: String,
    required: true,
    trim: true,
  },
  soQuyen: {
    type: Number,
    required: true,
    min: 0,
  },
  maNXB: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Publisher",
  },
  tenTG: {
    type: String,
    required: true,
    trim: true,
  },
});

bookSchema.index({ tenSach: 1, maNXB: 1 }, { unique: true });

module.exports = mongoose.model("Book", bookSchema);
