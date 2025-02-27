const mongoose = require("mongoose");
const Book = require("../models/Book");
const ApiError = require("../api-error");

exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find({}).populate("maNXB");
    if (books.length === 0) {
      return next(new ApiError(404, "No books found"));
    }
    return res.status(200).json({ books });
  } catch (error) {
    console.error("Error fetching books:", error);
    return next(new ApiError(500, "Internal Server Error"));
  }
};

exports.findBookByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    if (!name) {
      return next(new ApiError(400, "Name is required"));
    }
    const book = await Book.findOne({
      tenSach: new RegExp(name, "i"),
    }).populate("maNXB");
    if (!book) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.status(200).json({ book });
  } catch (error) {
    console.error("Error finding book by name:", error);
    return next(new ApiError(500, "Internal Server Error"));
  }
};

exports.findBookById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(new ApiError(400, "ID is required"));
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid book ID"));
    }
    const book = await Book.findById(id).populate("maNXB");
    if (!book) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.status(200).json({ book, message: "Book found" });
  } catch (error) {
    console.error("Error finding book by ID:", error);
    return next(new ApiError(500, "Internal Server Error"));
  }
};

exports.addBook = async (req, res, next) => {
  const { tenSach, soQuyen, maNXB, tenTG } = req.body;

  if (!tenSach || !soQuyen || !maNXB || !tenTG) {
    return next(new ApiError(400, "All fields are required"));
  }
  if (!mongoose.Types.ObjectId.isValid(maNXB)) {
    return next(new ApiError(400, "Invalid publisher ID"));
  }

  try {
    const existingBook = await Book.findOne({ tenSach, maNXB });
    if (existingBook) {
      return next(new ApiError(400, "Book already exists"));
    }

    const newBook = await Book.create({
      tenSach,
      soQuyen,
      maNXB,
      tenTG,
    });
    return res
      .status(201)
      .json({ message: "Book added successfully", book: newBook });
  } catch (error) {
    console.error("Error adding book:", error);
    return next(new ApiError(500, "Internal Server Error"));
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tenSach, soQuyen, maNXB, tenTG } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Valid ID is required"));
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { tenSach, soQuyen, maNXB, tenTG },
      { new: true, runValidators: true }
    );
    if (!updatedBook) {
      return next(new ApiError(404, "Book not found"));
    }
    return res
      .status(200)
      .json({ message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    console.error("Error updating book:", error);
    return next(new ApiError(500, "Internal Server Error"));
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Valid ID is required"));
    }

    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    return next(new ApiError(500, "Internal Server Error"));
  }
};

exports.deleteAllBooks = async (req, res, next) => {
  try {
    const result = await Book.deleteMany({});
    if (result.deletedCount === 0) {
      return next(new ApiError(404, "No books found to delete"));
    }
    return res
      .status(200)
      .json({ message: `Deleted ${result.deletedCount} books` });
  } catch (error) {
    console.error("Error deleting all books:", error);
    return next(new ApiError(500, "Internal Server Error"));
  }
};
