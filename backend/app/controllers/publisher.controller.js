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

exports.addPublisher = async (req, res, next) => {
  const { tenNXB, diaChi } = req.body;

  if (!tenNXB || !diaChi) {
    return next(new ApiError(400, "All fields are required"));
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
