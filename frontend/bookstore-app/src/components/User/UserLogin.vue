<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div
      class="card shadow-lg p-4 rounded-4"
      style="max-width: 400px; width: 100%"
    >
      <div
        class="card-header text-center bg-primary text-white fw-bold rounded-3"
      >
        <h4 class="mb-0">🔑 Đăng nhập Người dùng</h4>
      </div>
      <div class="card-body">
        <form @submit.prevent="login">
          <div class="mb-3">
            <label class="form-label fw-semibold">📞 Số điện thoại</label>
            <div class="input-group">
              <span class="input-group-text"
                ><i class="bi bi-telephone"></i
              ></span>
              <input
                v-model="soDienThoai"
                type="tel"
                class="form-control"
                required
                placeholder="Nhập số điện thoại"
              />
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">🔒 Mật khẩu</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-lock"></i></span>
              <input
                v-model="matKhau"
                type="password"
                class="form-control"
                required
                placeholder="Nhập mật khẩu"
              />
            </div>
          </div>

          <button type="submit" class="btn btn-primary w-100 fw-bold">
            🚀 Đăng nhập
          </button>
        </form>

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
      soDienThoai: "",
      matKhau: "",
      message: "",
      messageClass: "alert-info",
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/user/login",
          {
            soDienThoai: this.soDienThoai,
            password: this.matKhau, // Gửi password thay vì matKhau để khớp với backend
          }
        );

        this.message = "✅ Đăng nhập thành công! Đang chuyển hướng...";
        this.messageClass = "alert-success";

        const userId = response.data.reader._id.toString();
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
          throw new Error("Invalid user ID received from server");
        }

        localStorage.setItem("userId", userId);

        setTimeout(() => this.$router.push("/user/borrow"), 1000);
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
.card {
  border-radius: 12px;
  transition: all 0.3s ease-in-out;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

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

.btn {
  font-size: 1rem;
  padding: 10px;
}

.alert {
  transition: all 0.5s ease-in-out;
}
</style>
