<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div
      class="card shadow-lg p-4 rounded-4"
      style="max-width: 400px; width: 100%"
    >
      <div
        class="card-header text-center bg-primary text-white fw-bold rounded-3"
      >
        <h4 class="mb-0">🔐 Đăng nhập Quản lý</h4>
      </div>
      <div class="card-body">
        <form @submit.prevent="login">
          <!-- Mã nhân viên -->
          <div class="mb-3">
            <label class="form-label fw-semibold">📌 Mã nhân viên</label>
            <div class="input-group">
              <span class="input-group-text"
                ><i class="bi bi-person-badge"></i
              ></span>
              <input
                v-model="msNV"
                class="form-control"
                required
                placeholder="Nhập mã nhân viên"
              />
            </div>
          </div>

          <!-- Mật khẩu -->
          <div class="mb-3">
            <label class="form-label fw-semibold">🔑 Mật khẩu</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-lock"></i></span>
              <input
                v-model="password"
                type="password"
                class="form-control"
                required
                placeholder="Nhập mật khẩu"
              />
            </div>
          </div>

          <!-- Nút đăng nhập -->
          <button type="submit" class="btn btn-primary w-100 fw-bold">
            🚀 Đăng nhập
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
      msNV: "",
      password: "",
      message: "",
      messageClass: "alert-info",
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/manager/login",
          {
            msNV: this.msNV,
            password: this.password,
          }
        );
        this.message = "✅ Đăng nhập thành công!";
        this.messageClass = "alert-success";
        localStorage.setItem("managerId", response.data.employee._id);
        setTimeout(() => this.$router.push("/manager/dashboard"), 1000);
      } catch (error) {
        this.message =
          "❌ " + (error.response?.data.message || "Đăng nhập thất bại");
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
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
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
