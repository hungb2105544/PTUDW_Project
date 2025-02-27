<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div
      class="card shadow-lg p-4 rounded-4"
      style="max-width: 450px; width: 100%"
    >
      <div
        class="card-header text-center bg-success text-white fw-bold rounded-3"
      >
        <h4 class="mb-0">📝 Đăng ký Quản lý</h4>
      </div>
      <div class="card-body">
        <form @submit.prevent="register">
          <!-- Mã nhân viên -->
          <div class="mb-3">
            <label class="form-label fw-semibold">📌 Mã nhân viên</label>
            <div class="input-group">
              <span class="input-group-text"
                ><i class="bi bi-person-badge"></i
              ></span>
              <input
                v-model="form.msNV"
                class="form-control"
                required
                placeholder="Nhập mã nhân viên"
              />
            </div>
          </div>

          <!-- Họ tên -->
          <div class="mb-3">
            <label class="form-label fw-semibold">👤 Họ tên</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-person"></i></span>
              <input
                v-model="form.hoTen"
                class="form-control"
                required
                placeholder="Nhập họ tên"
              />
            </div>
          </div>

          <!-- Mật khẩu -->
          <div class="mb-3">
            <label class="form-label fw-semibold">🔑 Mật khẩu</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-lock"></i></span>
              <input
                v-model="form.password"
                type="password"
                class="form-control"
                required
                placeholder="Nhập mật khẩu"
              />
            </div>
          </div>

          <!-- Chức vụ -->
          <div class="mb-3">
            <label class="form-label fw-semibold">🏢 Chức vụ</label>
            <select v-model="form.chucVu" class="form-select" required>
              <option value="admin">Admin</option>
              <option value="staff">Nhân viên</option>
            </select>
          </div>

          <!-- Địa chỉ -->
          <div class="mb-3">
            <label class="form-label fw-semibold">📍 Địa chỉ</label>
            <div class="input-group">
              <span class="input-group-text"
                ><i class="bi bi-geo-alt"></i
              ></span>
              <input
                v-model="form.diaChi"
                class="form-control"
                required
                placeholder="Nhập địa chỉ"
              />
            </div>
          </div>

          <!-- Số điện thoại -->
          <div class="mb-3">
            <label class="form-label fw-semibold">📞 Số điện thoại</label>
            <div class="input-group">
              <span class="input-group-text"
                ><i class="bi bi-telephone"></i
              ></span>
              <input
                v-model="form.soDienThoai"
                class="form-control"
                required
                placeholder="Nhập số điện thoại"
              />
            </div>
          </div>

          <!-- Nút đăng ký -->
          <button type="submit" class="btn btn-success w-100 fw-bold">
            🚀 Đăng ký
          </button>
        </form>

        <!-- Hiển thị thông báo -->
        <div v-if="message" class="alert mt-3" :class="messageClass">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      form: {
        msNV: "",
        hoTen: "",
        password: "",
        chucVu: "staff",
        diaChi: "",
        soDienThoai: "",
      },
      message: "",
      messageClass: "alert-info",
    };
  },
  methods: {
    async register() {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/manager/register",
          this.form
        );
        this.message = "✅ Đăng ký thành công! Chuyển hướng...";
        this.messageClass = "alert-success";

        // Chuyển hướng sau 1 giây
        setTimeout(() => this.$router.push("/manager/login"), 1000);
      } catch (error) {
        this.message =
          "❌ " + (error.response?.data.message || "Đăng ký thất bại");
        this.messageClass = "alert-danger";
      }
    },
  },
};
</script>

<style>
/* Cải thiện giao diện */
.card {
  border-radius: 12px;
  transition: all 0.3s ease-in-out;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

/* Tùy chỉnh ô nhập */
.input-group-text {
  background-color: #f8f9fa;
  border-right: none;
}
.form-control {
  border-left: none;
}
.form-control:focus {
  border-color: #28a745;
  box-shadow: 0 0 5px rgba(40, 167, 69, 0.5);
}

/* Tăng kích thước nút */
.btn {
  font-size: 1rem;
  padding: 10px;
}

/* Hiệu ứng thông báo */
.alert {
  transition: all 0.5s ease-in-out;
}
</style>
