<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <a class="navbar-brand" href="#">BookStore</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" to="/user/login">Đăng nhập người dùng</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/user/register">Đăng ký người dùng</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/manager/login">Đăng nhập quản lý</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/manager/register">Đăng ký quản lý</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>