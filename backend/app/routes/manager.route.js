const express = require("express");
const router = express.Router();
const borrowController = require("../controllers/borrowbook.controller");
const employeeController = require("../controllers/employee.controller");
const bookController = require("../controllers/book.controller");
const publisherController = require("../controllers/publisher.controller");

// Lấy về tất cả các quyển sách
router.route("/book").get(bookController.getAllBooks);

// Thêm sách mới
router.route("/book/add").post(bookController.addBook);

// Tìm kiếm sách theo tên
router.route("/book/find/:name").get(bookController.findBookByName);

// Lấy thông tin sách theo ID (thêm route bị thiếu)
router.route("/book/:id").get(bookController.findBookById);

// Cập nhật thông tin sách theo ID
router.route("/book/:id").put(bookController.updateBook);

// Xóa một quyển sách theo ID
router.route("/book/:id").delete(bookController.deleteBook);

// Xóa toàn bộ sách
router.route("/book").delete(bookController.deleteAllBooks);

// Lấy tất cả thông tin mượn sách
router.route("/borrow").get(borrowController.getAllBorrowBooks);

// Cập nhật trạng thái mượn/trả sách theo borrow ID
router
  .route("/borrow/:borrowId")
  .patch(borrowController.updateStateOfBorrowFromUser)
  .delete(borrowController.deleteBorrowBook);

// Đăng nhập và đăng ký cho employee
router.route("/login").post(employeeController.login);
router.route("/register").post(employeeController.register);

// Quản lý nhà xuất bản
router.route("/publisher").get(publisherController.getAllPublishers);
router.route("/publisher/add").post(publisherController.addPublisher);
router.route("/publisher/:id").put(publisherController.updatePublisher);
router.route("/publisher/:id").delete(publisherController.deletePublisher);
router.route("/publisher").delete(publisherController.deleteAllPublishers);

module.exports = router;
