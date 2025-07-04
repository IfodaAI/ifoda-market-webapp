import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  const addToCart = (product) => {
    const existing = items.value.find((item) => item.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  const removeFromCart = (id) => {
    items.value = items.value.filter((item) => item.id !== id)
  }

  const increment = (id) => {
    const item = items.value.find((i) => i.id === id)
    if (item) item.quantity++
  }

  const decrement = (id) => {
    const item = items.value.find((i) => i.id === id)
    if (item && item.quantity > 1) {
      item.quantity--
    } else {
      removeFromCart(id)
    }
  }

  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  return {
    items,
    addToCart,
    removeFromCart,
    increment,
    decrement,
    total,
  }
})
