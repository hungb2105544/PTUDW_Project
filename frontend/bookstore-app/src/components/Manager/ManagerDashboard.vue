<template>
  <div class="container mt-5 dashboard">
    <h2 class="text-center mb-4 title">Dashboard Quản lý</h2>

    <!-- Thêm nhà xuất bản -->
    <div class="card mb-4 shadow-sm">
      <div class="card-header bg-primary text-white">Thêm Nhà Xuất Bản</div>
      <div class="card-body">
        <form @submit.prevent="addPublisher" class="row g-3 align-items-center">
          <div class="col-md-5">
            <input
              v-model="publisher.tenNXB"
              class="form-control rounded-pill"
              placeholder="Tên NXB"
              required
            />
          </div>
          <div class="col-md-5">
            <input
              v-model="publisher.diaChi"
              class="form-control rounded-pill"
              placeholder="Địa chỉ"
              required
            />
          </div>
          <div class="col-md-2 text-end">
            <button type="submit" class="btn btn-success btn-custom">
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Thêm sách -->
    <div class="card mb-4 shadow-sm">
      <div class="card-header bg-primary text-white">Thêm Sách</div>
      <div class="card-body">
        <form @submit.prevent="addBook" class="row g-3 align-items-center">
          <div class="col-md-3">
            <input
              v-model="book.tenSach"
              class="form-control rounded-pill"
              placeholder="Tên sách"
              required
            />
          </div>
          <div class="col-md-2">
            <input
              v-model.number="book.soQuyen"
              type="number"
              class="form-control rounded-pill"
              placeholder="Số quyền"
              required
            />
          </div>
          <div class="col-md-3">
            <select
              v-model="book.maNXB"
              class="form-select rounded-pill"
              required
            >
              <option v-for="pub in publishers" :key="pub._id" :value="pub._id">
                {{ pub.tenNXB }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <input
              v-model="book.tenTG"
              class="form-control rounded-pill"
              placeholder="Tên tác giả"
              required
            />
          </div>
          <div class="col-md-1 text-end">
            <button type="submit" class="btn btn-success btn-custom">
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Danh sách sách -->
    <div class="card mb-4 shadow-sm">
      <div class="card-header bg-primary text-white">Danh Sách Sách</div>
      <div class="card-body">
        <table class="table table-striped table-hover custom-table">
          <thead class="table-dark">
            <tr>
              <th>Tên sách</th>
              <th>Số quyền</th>
              <th>Tác giả</th>
              <th>Nhà xuất bản</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in books" :key="book._id">
              <td>{{ book.tenSach }}</td>
              <td>{{ book.soQuyen }}</td>
              <td>{{ book.tenTG }}</td>
              <td>{{ book.maNXB.tenNXB }}</td>
              <td>
                <button
                  class="btn btn-warning btn-sm me-2"
                  @click="editBook(book)"
                >
                  Cập nhật
                </button>
                <button
                  class="btn btn-danger btn-sm"
                  @click="deleteBook(book._id)"
                >
                  Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <button class="btn btn-danger btn-custom mt-3" @click="deleteAllBooks">
          Xóa Tất Cả Sách
        </button>
      </div>
    </div>

    <!-- Danh sách mượn sách -->
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">Danh Sách Mượn Sách</div>
      <div class="card-body">
        <table class="table table-striped table-hover custom-table">
          <thead class="table-dark">
            <tr>
              <th>Tên sách</th>
              <th>Người mượn</th>
              <th>Trạng thái</th>
              <th>Ngày phải trả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="borrow in borrows" :key="borrow._id">
              <td>{{ borrow.idSach.tenSach }}</td>
              <td>{{ borrow.idDG.ten }}</td>
              <td>
                <span
                  :class="
                    borrow.trangThai === 'Returned'
                      ? 'badge bg-success'
                      : 'badge bg-warning'
                  "
                >
                  {{ borrow.trangThai }}
                </span>
              </td>
              <td>{{ new Date(borrow.ngayPhaiTra).toLocaleDateString() }}</td>
              <td>
                <button
                  class="btn btn-info btn-sm"
                  @click="updateBorrow(borrow._id)"
                  :disabled="borrow.trangThai === 'Returned'"
                >
                  Cập nhật Trạng Thái
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal cập nhật sách -->
    <div class="modal fade" id="editBookModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">Cập nhật Sách</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label class="form-label">Tên sách</label>
                <input
                  v-model="editBookData.tenSach"
                  class="form-control rounded-pill"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Số quyền</label>
                <input
                  v-model.number="editBookData.soQuyen"
                  type="number"
                  class="form-control rounded-pill"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Tên tác giả</label>
                <input
                  v-model="editBookData.tenTG"
                  class="form-control rounded-pill"
                  required
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary rounded-pill"
              data-bs-dismiss="modal"
            >
              Đóng
            </button>
            <button
              type="button"
              class="btn btn-primary rounded-pill"
              @click="saveBook"
              data-bs-dismiss="modal"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Modal } from "bootstrap";
import Swal from "sweetalert2";
export default {
  data() {
    return {
      publisher: { tenNXB: "", diaChi: "" },
      book: { tenSach: "", soQuyen: 0, maNXB: "", tenTG: "" },
      editBookData: { _id: "", tenSach: "", soQuyen: 0, maNXB: "", tenTG: "" },
      publishers: [],
      books: [],
      borrows: [],
      managerId: localStorage.getItem("managerId"),
    };
  },
  methods: {
    async fetchPublishers() {
      const response = await axios.get(
        "http://localhost:3000/api/manager/publisher"
      );
      this.publishers = response.data.publishers;
      if (this.publishers.length > 0) this.book.maNXB = this.publishers[0]._id;
    },
    async fetchBooks() {
      const response = await axios.get(
        "http://localhost:3000/api/manager/book"
      );
      console.log(response.data);
      this.books = response.data.books.map((book) => ({
        ...book,
        maNXB: book.maNXB || { tenNXB: "Không có nhà xuất bản" }, // Giá trị mặc định nếu maNXB là null
      }));
    },
    async fetchBorrows() {
      const response = await axios.get(
        "http://localhost:3000/api/manager/borrow"
      );
      console.log(response.data);
      this.borrows = response.data.borrowRecords;
    },
    async addPublisher() {
      await axios.post(
        "http://localhost:3000/api/manager/publisher/add",
        this.publisher
      );
      this.fetchPublishers();
      this.publisher = { tenNXB: "", diaChi: "" };
      Swal.fire("Thành công", "Thêm nhà xuất bản thành công", "success");
    },
    async addBook() {
      await axios.post("http://localhost:3000/api/manager/book/add", this.book);
      this.fetchBooks();
      this.book = {
        tenSach: "",
        soQuyen: 0,
        maNXB: this.publishers[0]._id,
        tenTG: "",
      };
      Swal.fire("Thành công", "Thêm sách thành công", "success");
    },
    editBook(book) {
      this.editBookData = { ...book };
      const modal = new Modal(document.getElementById("editBookModal"));
      modal.show();
    },
    async saveBook() {
      await axios.put(
        `http://localhost:3000/api/manager/book/${this.editBookData._id}`,
        this.editBookData
      );
      this.fetchBooks();
      Swal.fire("Thành công", "Cập nhật sách thành công", "success");
    },
    async deleteBook(id) {
      if (confirm("Xóa sách này?")) {
        await axios.delete(`http://localhost:3000/api/manager/book/${id}`);
        this.fetchBooks();
        Swal.fire("Thành công", "Xóa sách thành công", "success");
      }
    },
    async deleteAllBooks() {
      if (confirm("Xóa tất cả sách?")) {
        await axios.delete("http://localhost:3000/api/manager/book");
        this.fetchBooks();
        Swal.fire("Thành công", "Xóa tất cả sách thành công", "success");
      }
    },
    async updateBorrow(idBorrow) {
      try {
        const response = await axios.patch(
          `http://localhost:3000/api/manager/borrow/${idBorrow}`,
          {
            trangThai: "Returned",
            ngayTra: new Date().toISOString().split("T")[0],
          }
        );
        await this.fetchBorrows();
        await this.fetchBooks();
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Cập nhật trạng thái thành công",
        });
      } catch (error) {
        console.error(
          "Lỗi khi cập nhật:",
          error.response?.data || error.message
        );
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text:
            error.response?.data?.message || // Lấy thông báo lỗi từ server
            "Có lỗi xảy ra khi cập nhật trạng thái",
        });
      }
    },
  },
  mounted() {
    if (!this.managerId) this.$router.push("/manager/login");
    this.fetchPublishers();
    this.fetchBooks();
    this.fetchBorrows();
  },
};
</script>
<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Arial", sans-serif;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card {
  border: none;
  border-radius: 15px;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card-header {
  border-radius: 15px 15px 0 0;
  font-weight: bold;
  font-size: 1.2rem;
}

.form-control,
.form-select {
  border-radius: 25px;
  padding: 10px 15px;
  border: 1px solid #ced4da;
  transition: border-color 0.3s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.btn-custom {
  border-radius: 25px;
  padding: 8px 20px;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-custom:hover {
  transform: scale(1.05);
}

.btn-success {
  background-color: #28a745;
  border: none;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-warning {
  background-color: #ffc107;
  border: none;
}

.btn-warning:hover {
  background-color: #e0a800;
}

.btn-danger {
  background-color: #dc3545;
  border: none;
}

.btn-danger:hover {
  background-color: #c82333;
}

.btn-info {
  background-color: #17a2b8;
  border: none;
}

.btn-info:hover {
  background-color: #138496;
}

.custom-table {
  border-radius: 10px;
  overflow: hidden;
}

.table th,
.table td {
  vertical-align: middle;
  padding: 12px;
}

.table-hover tbody tr:hover {
  background-color: #f1f3f5;
}

.badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: bold;
}

/* Responsive */
@media (max-width: 768px) {
  .row {
    flex-direction: column;
    align-items: stretch;
  }
  .col-md-1,
  .col-md-2,
  .col-md-3,
  .col-md-5 {
    width: 100%;
    margin-bottom: 10px;
  }
  .btn-custom {
    width: 100%;
  }
}
</style>
