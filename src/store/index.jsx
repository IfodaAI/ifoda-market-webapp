// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Search from "../pages/Search.vue";
import Cart from "../pages/Cart.vue";
import Profile from "../pages/Profile.vue";

const routes = [
  { path: "/", component: Home },
  // { path: "/search", component: Search },
  { path: "/cart", component: Cart },
  { path: "/profile", component: Profile },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
