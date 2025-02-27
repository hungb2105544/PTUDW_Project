import { createRouter, createWebHistory } from "vue-router";
import UserLogin from "../components/User/UserLogin.vue";
import UserRegister from "../components/User/UserRegister.vue";
import UserBorrow from "../components/User/UserBorrow.vue";
import ManagerLogin from "../components/Manager/ManagerLogin.vue";
import ManagerRegister from "../components/Manager/ManagerRegister.vue";
import ManagerDashboard from "../components/Manager/ManagerDashboard.vue";

const routes = [
  { path: "/user/login", component: UserLogin },
  { path: "/user/register", component: UserRegister },
  { path: "/user/borrow", component: UserBorrow },
  { path: "/manager/login", component: ManagerLogin },
  { path: "/manager/register", component: ManagerRegister },
  { path: "/manager/dashboard", component: ManagerDashboard },
  { path: "/", redirect: "/user/login" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
