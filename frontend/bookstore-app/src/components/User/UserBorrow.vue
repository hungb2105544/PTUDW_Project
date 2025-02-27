<template>
  <div class="container mt-5">
    <h2>Mượn sách</h2>

    <!-- Thanh tìm kiếm và sắp xếp -->
    <div class="row mb-3">
      <div class="col-md-6">
        <div class="input-group">
          <input
            v-model="searchQuery"
            class="form-control"
            placeholder="Tìm kiếm sách theo tên"
            @input="filterBooks"
          />
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="clearSearch"
          >
            Xóa
          </button>
        </div>
      </div>
      <div class="col-md-6 text-end">
        <select
          v-model="sortBy"
          class="form-select w-auto d-inline-block"
          @change="sortBooks"
        >
          <option value="tenSach">Sắp xếp theo tên sách</option>
          <option value="soQuyen">Sắp xếp theo số quyền</option>
        </select>
      </div>
    </div>

    <!-- Danh sách sách -->
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div
            class="card-header d-flex justify-content-between align-items-center"
          >
            <span>Danh sách sách</span>
            <span>Tổng: {{ totalBooks }}</span>
          </div>
          <div class="card-body">
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Tên sách</th>
                  <th>Tác giả</th>
                  <th>Số quyền</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="book in paginatedBooks" :key="book._id">
                  <td>{{ book.tenSach }}</td>
                  <td>{{ book.tenTG }}</td>
                  <td>{{ book.soQuyen }}</td>
                  <td>
                    <button
                      class="btn btn-primary btn-sm"
                      :disabled="book.soQuyen === 0"
                      @click="borrowBook(book._id)"
                      :title="
                        book.soQuyen === 0
                          ? 'Hết sách trong kho'
                          : 'Nhấn để mượn sách'
                      "
                    >
                      Mượn
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Phân trang -->
            <nav v-if="totalPages > 1">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button class="page-link" @click="prevPage">Trước</button>
                </li>
                <li
                  v-for="page in totalPages"
                  :key="page"
                  class="page-item"
                  :class="{ active: currentPage === page }"
                >
                  <button class="page-link" @click="goToPage(page)">
                    {{ page }}
                  </button>
                </li>
                <li
                  class="page-item"
                  :class="{ disabled: currentPage === totalPages }"
                >
                  <button class="page-link" @click="nextPage">Sau</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <!-- Sách đang mượn -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">Sách đang mượn</div>
          <div class="card-body">
            <table
              v-if="borrows.length > 0"
              class="table table-striped table-hover"
            >
              <thead>
                <tr>
                  <th>Tên sách</th>
                  <th>Trạng thái</th>
                  <th>Ngày phải trả</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="borrow in borrows" :key="borrow._id">
                  <td>{{ borrow.idSach.tenSach }}</td>
                  <td>{{ borrow.trangThai }}</td>
                  <td>
                    {{ new Date(borrow.ngayPhaiTra).toLocaleDateString() }}
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else class="text-center text-muted">
              Không có sách đang mượn.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      books: [],
      filteredBooks: [],
      borrows: [],
      userId: localStorage.getItem("userId"),
      searchQuery: "",
      sortBy: "tenSach",
      currentPage: 1,
      booksPerPage: 5,
      loading: false,
    };
  },
  computed: {
    totalBooks() {
      return this.filteredBooks.length;
    },
    totalPages() {
      return Math.ceil(this.totalBooks / this.booksPerPage);
    },
    paginatedBooks() {
      const start = (this.currentPage - 1) * this.booksPerPage;
      const end = start + this.booksPerPage;
      return this.filteredBooks.slice(start, end);
    },
  },
  methods: {
    async fetchBooks() {
      this.loading = true;
      try {
        const response = await axios.get("http://localhost:3000/api/user/book");
        this.books = response.data.books.map((book) => ({
          ...book,
          _id: book._id.toString(),
        }));
        this.filteredBooks = [...this.books];
        this.sortBooks();
      } catch (error) {
        console.error("Lỗi khi lấy sách:", error);
        Swal.fire("Lỗi", "Không thể tải danh sách sách", "error");
      } finally {
        this.loading = false;
      }
    },
    async fetchBorrows() {
      this.loading = true;
      try {
        console.log("Fetching borrows for user ID:", this.userId);
        const response = await axios.get(
          `http://localhost:3000/api/user/book/borrow/${this.userId}`
        );
        console.log("Dữ liệu sách đang mượn:", response.data);
        if (!response.data.borrowRecords) {
          throw new Error("Invalid borrow records received from server");
          thiss.borrows = [];
        }
        this.borrows = response.data.borrowRecords;
      } catch (error) {
        console.error("Lỗi khi lấy sách đang mượn:", error);
        // Swal.fire(
        //   "Lỗi",
        //   error.response?.data.message ||
        //     "Không thể tải danh sách sách đang mượn",
        //   "error"
        // );
      } finally {
        this.loading = false;
      }
    },
    async borrowBook(idSach) {
      // Loại bỏ tham số userId không cần thiết
      const book = this.books.find((b) => b._id === idSach);
      if (!book) {
        Swal.fire("Lỗi", "Sách không tồn tại!", "error");
        return;
      }
      if (book.soQuyen <= 0) {
        Swal.fire("Lỗi", "Sách hiện không còn trong kho!", "error");
        return;
      }

      if (!this.userId || !this.userId.match(/^[0-9a-fA-F]{24}$/)) {
        Swal.fire("Lỗi", "Vui lòng đăng nhập lại!", "error");
        this.$router.push("/user/login");
        return;
      }

      this.loading = true;
      try {
        const borrowData = {
          idSach: idSach.toString(),
          ngayMuon: new Date().toISOString().split("T")[0],
          ngayPhaiTra: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          trangThai: "Borrowed",
        };

        console.log("Dữ liệu gửi lên:", borrowData);

        const response = await axios.post(
          `http://localhost:3000/api/user/book/borrow/${this.userId}`,
          borrowData
        );

        console.log("Phản hồi từ server:", response.data);
        this.fetchBorrows();
        this.fetchBooks();
        Swal.fire("Thành công", "Đã mượn sách thành công!", "success");
      } catch (error) {
        console.error("Lỗi khi mượn sách:", error.response || error);
        const errorMessage =
          error.response?.data?.message || "Không thể mượn sách!";
        Swal.fire("Lỗi", errorMessage, "error");
      } finally {
        this.loading = false;
      }
    },
    filterBooks() {
      const query = this.searchQuery.toLowerCase();
      this.filteredBooks = this.books.filter((book) =>
        book.tenSach.toLowerCase().includes(query)
      );
      this.currentPage = 1;
      this.sortBooks();
    },
    clearSearch() {
      this.searchQuery = "";
      this.filteredBooks = [...this.books];
      this.currentPage = 1;
      this.sortBooks();
    },
    sortBooks() {
      this.filteredBooks.sort((a, b) => {
        if (this.sortBy === "tenSach") {
          return a.tenSach.localeCompare(b.tenSach);
        } else if (this.sortBy === "soQuyen") {
          return b.soQuyen - a.soQuyen;
        }
        return 0;
      });
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    goToPage(page) {
      this.currentPage = page;
    },
  },
  mounted() {
    if (!this.userId || !this.userId.match(/^[0-9a-fA-F]{24}$/)) {
      Swal.fire("Lỗi", "Vui lòng đăng nhập lại!", "error");
      this.$router.push("/user/login");
    }
    this.fetchBooks();
    this.fetchBorrows();
  },
};
</script>

<style scoped>
.table {
  font-size: 0.9rem;
}
.pagination {
  margin-top: 1rem;
}
.spinner-border {
  width: 2rem;
  height: 2rem;
}
.btn-sm {
  transition: all 0.3s ease;
}
.btn-sm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.text-muted {
  padding: 1rem;
}
</style>
