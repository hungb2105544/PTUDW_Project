const mongoose = require("mongoose");
const Publisher = require("../models/Publisher");
const ApiError = require("../api-error");

exports.getAllPublishers = async (req, res, next) => {
  try {
    const publishers = await Publisher.find({});
    if (publishers.length === 0) {
      return next(new ApiError(404, "No publishers found"));
    }
    return res.status(200).json({ publishers });
  } catch (error) {
    console.error("Error fetching publishers:", error);
    return next(new ApiError(500, "Internal Server Error"));
  }
};

exports.updatePublisher = async (req, res, next) => {
  const { tenNXB, diaChi } = req.body;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, "Invalid Publisher ID"));
  }

  if (!tenNXB || !diaChi) {
    return next(new ApiError(400, "All fields (tenNXB, diaChi) are required"));
  }

  try {
    const publisher = await Publisher.findById(id);
    if (!publisher) {
      return next(new ApiError(404, "Publisher not found"));
    }

    publisher.tenNXB = tenNXB;
    publisher.diaChi = diaChi;

    await publisher.save();

    return res.status(200).json({
      message: "Publisher updated successfully",
      publisher,
    });
  } catch (error) {
    console.error("Error updating publisher:", error);
    return next(new ApiError(500, "Internal Server Error"));
  }
};

exports.deletePublisher = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, "Invalid Publisher ID"));
  }

  try {
    const publisher = await Publisher.findById(id);
    if (!publisher) {
      return next(new ApiError(404, "Publisher not found"));
    }

    await publisher.remove();

    return res.status(200).json({
      message: "Publisher deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting publisher:", error);
    return next(new ApiError(500, "Internal Server Error"));
  }
};

exports.deleteAllPublishers = async (req, res, next) => {
  try {
    await Publisher.deleteMany({});
    return res.status(200).json({
      message: "All publishers deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting all publishers:", error);
    return next(new ApiError(500, "Internal Server Error"));
  }
};

exports.addPublisher = async (req, res, next) => {
  const { tenNXB, diaChi } = req.body;

  if (!tenNXB || !diaChi) {
    return next(new ApiError(400, "All fields (tenNXB, diaChi) are required"));
  }

  try {
    const existingPublisher = await Publisher.findOne({ tenNXB });
    if (existingPublisher) {
      return next(new ApiError(400, "Publisher already exists"));
    }

    const newPublisher = await Publisher.create({
      tenNXB,
      diaChi,
    });

    return res.status(201).json({
      message: "Publisher added successfully",
      publisher: newPublisher,
    });
  } catch (error) {
    console.error("Error adding publisher:", error);
    return next(new ApiError(500, "Internal Server Error"));
  }
};
