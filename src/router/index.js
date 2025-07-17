import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Search from '../pages/Search.vue'
import Cart from '../pages/Cart.vue'
import Profile from '../pages/Profile.vue'
import ProductDetail from '../pages/ProductDetail.vue'
import ChatPage from '../pages/ChatPage.vue'
import OrdersPage from '../pages/OrdersPage.vue'
import ChatListPage from '../pages/ChatListPage.vue'
import Register from '../pages/Register.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/search', component: Search },
  { path: '/cart', component: Cart },
  { path: '/chats', component: ChatListPage },
  { path: '/chat/:id', component: ChatPage },
  { path: '/orders', component: OrdersPage },
  { path: '/profile', component: Profile },
  { path: '/product/:id', component: ProductDetail },
  { path: '/register', component: Register },
  // Agar noto'g'ri manzil kiritilsa, asosiy sahifaga yo'naltiramiz
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router