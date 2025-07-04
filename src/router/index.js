import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Search from '../pages/Search.vue'
import Cart from '../pages/Cart.vue'
import Profile from '../pages/Profile.vue'
import ProductDetail from '../pages/ProductDetail.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/search', component: Search },
  { path: '/cart', component: Cart },
  { path: '/profile', component: Profile },
  { path: '/product/:id', component: ProductDetail } 
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
