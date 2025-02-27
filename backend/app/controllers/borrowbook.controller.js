const mongoose = require("mongoose");
const BorrowBook = require("../models/BorrowBook");
const Book = require("../models/Book");
const ApiError = require("../api-error");
const Reader = require("../models/Reader");

exports.getBorrowByUserId = async (req, res, next) => {
  try {
    const { idDG } = req.params;
    console.log("Request params:", req.params);

    if (!idDG || !mongoose.Types.ObjectId.isValid(idDG)) {
      return next(new ApiError(400, "Valid user ID is required"));
    }

    const borrowRecords = await BorrowBook.find({ idDG })
      .populate("idSach")
      .populate("idDG");

    if (!borrowRecords.length) {
      return next(new ApiError(404, "No borrow records found for this user"));
    }

    return res.status(200).json({ borrowRecords });
  } catch (error) {
    console.error("Error fetching borrow records:", error);
    return next(new ApiError(500, "Internal Server Error"));
  }
};

exports.borrowBook = async (req, res, next) => {
  try {
    const { idSach, ngayMuon, ngayPhaiTra, trangThai } = req.body;
    const { idDG } = req.params;

    console.log("Request params:", req.params);
    console.log("Request body:", req.body);

    if (!idDG || !idSach || !ngayMuon || !ngayPhaiTra || !trangThai) {
      return next(new ApiError(400, "All required fields must be provided"));
    }

    if (
      !mongoose.Types.ObjectId.isValid(idDG) ||
      !mongoose.Types.ObjectId.isValid(idSach)
    ) {
      return next(new ApiError(400, "Invalid Reader or Book ID"));
    }

    if (!["Borrowed", "Returned"].includes(trangThai)) {
      return next(
        new ApiError(400, "Status must be either 'Borrowed' or 'Returned'")
      );
    }

    const reader = await Reader.findById(idDG);
    if (!reader) {
      return next(new ApiError(404, "Reader not found"));
    }

    const book = await Book.findById(idSach);
    if (!book) {
      return next(new ApiError(404, "Book not found"));
    }

    if (book.soQuyen <= 0) {
      return next(new ApiError(400, "Book is not available"));
    }

    const borrowRecord = await BorrowBook.create({
      idDG,
      idSach,
      ngayMuon: new Date(ngayMuon),
      trangThai,
      ngayPhaiTra: new Date(ngayPhaiTra),
      ngayTra: null,
    });

    book.soQuyen -= 1;
    await book.save();

    return res.status(201).json({
      message: "Book borrowed successfully",
      borrowRecord,
    });
  } catch (error) {
    console.error("Error borrowing book:", error);
    return next(new ApiError(500, `Internal Server Error: ${error.message}`));
  }
};

exports.getAllBorrowBooks = async (req, res, next) => {
  try {
    const borrowRecords = await BorrowBook.find({})
      .populate("idSach")
      .populate("idDG");

    if (!borrowRecords.length) {
      return next(new ApiError(404, "No borrow records found"));
    }

    return res.status(200).json({ borrowRecords });
  } catch (error) {
    console.error("Error fetching all borrow records:", error);
    return next(new ApiError(500, "Internal Server Error"));
  }
};

exports.updateStateOfBorrowFromUser = async (req, res, next) => {
  try {
    const { borrowId } = req.params; // Đồng bộ với router
    const { trangThai, ngayTra } = req.body;

    console.log("Request params:", req.params);
    console.log("Request body:", req.body);

    if (!borrowId || !mongoose.Types.ObjectId.isValid(borrowId)) {
      return next(new ApiError(400, "Valid borrow ID is required"));
    }
    if (!trangThai) {
      return next(new ApiError(400, "Status is required"));
    }

    const borrowRecord = await BorrowBook.findById(borrowId);
    if (!borrowRecord) {
      return next(new ApiError(404, "Borrow record not found"));
    }

    borrowRecord.trangThai = trangThai;

    const ngayMuonDate = new Date(borrowRecord.ngayMuon);
    if (trangThai === "Returned") {
      const ngayTraDate = ngayTra ? new Date(ngayTra) : new Date();
      if (ngayTraDate < ngayMuonDate) {
        return next(
          new ApiError(400, "Return date cannot be before borrow date")
        );
      }
      borrowRecord.ngayTra = ngayTraDate;
    } else if (ngayTra) {
      const ngayTraDate = new Date(ngayTra);
      if (ngayTraDate < ngayMuonDate) {
        return next(
          new ApiError(400, "Return date cannot be before borrow date")
        );
      }
      borrowRecord.ngayTra = ngayTraDate;
    }

    await borrowRecord.save();

    if (trangThai === "Returned") {
      const book = await Book.findById(borrowRecord.idSach);
      if (!book) {
        return next(new ApiError(404, "Book not found"));
      }
      book.soQuyen += 1;
      await book.save();
    }

    return res.status(200).json({
      message: "Borrow state updated",
      borrowRecord: {
        id: borrowRecord._id,
        trangThai: borrowRecord.trangThai,
        ngayTra: borrowRecord.ngayTra,
      },
    });
  } catch (error) {
    console.error("Error updating borrow state:", error);
    return next(new ApiError(500, "Internal Server Error"));
  }
};

exports.deleteBorrowBook = async (req, res, next) => {
  try {
    const { borrowId } = req.params;

    console.log("Request params:", req.params);

    if (!borrowId || !mongoose.Types.ObjectId.isValid(borrowId)) {
      return next(new ApiError(400, "Valid borrow ID is required"));
    }

    await BorrowBook.findByIdAndDelete(borrowId);
    return res.status(200).json({ message: "Borrow record deleted" });
  } catch (error) {
    console.error("Error deleting borrow record:", error);
    return next(new ApiError(500, "Internal Server Error"));
  }
};
