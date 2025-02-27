const mongoose = require("mongoose");

const publisherSchema = new mongoose.Schema({
  tenNXB: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  diaChi: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model("Publisher", publisherSchema);
