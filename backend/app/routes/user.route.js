const express = require("express");
const bookController = require("../controllers/book.controller");
const borrowController = require("../controllers/borrowbook.controller");
const readerController = require("../controllers/reader.controller");
const router = express.Router();

router.route("/book").get(bookController.getAllBooks);

router.route("/book/find/:name").get(bookController.findBookByName);

router
  .route("/book/borrow/:idDG")
  .get(borrowController.getBorrowByUserId)
  .post(borrowController.borrowBook);
router.route("/login").post(readerController.login);
router.route("/register").post(readerController.register);

module.exports = router;
