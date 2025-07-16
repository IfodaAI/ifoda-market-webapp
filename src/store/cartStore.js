import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useCartStore = defineStore('cart', () => {
  // LocalStorage'dan savatni yuklash
  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem('cart')
    return savedCart ? JSON.parse(savedCart) : []
  }

  const items = ref(loadCartFromStorage())
  const isLoading = ref(false)
  const error = ref(null)

  // Jami narx
  const total = computed(() => {
    return items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  })

  // Savatni localStorage ga saqlash
  const saveCartToStorage = () => {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }

  // Mahsulot qo'shish
  const addToCart = (product) => {
    const existingItem = items.value.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
    saveCartToStorage()
  }

  // Mahsulotni o'chirish
  const removeFromCart = (productId) => {
    items.value = items.value.filter(item => item.id !== productId)
    saveCartToStorage()
  }

  // Miqdorni oshirish
  const increment = (productId) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      item.quantity += 1
      saveCartToStorage()
    }
  }

  // Miqdorni kamaytirish
  const decrement = (productId) => {
    const item = items.value.find(item => item.id === productId)
    if (item && item.quantity > 1) {
      item.quantity -= 1
      saveCartToStorage()
    } else {
      removeFromCart(productId)
    }
  }

  // Savatni tozalash
  const clearCart = () => {
    items.value = []
    saveCartToStorage()
  }

  // APIga buyurtma yuborish
  const submitOrder = async (customerData) => {
    isLoading.value = true
    error.value = null
    
    try {
      const orderItems = items.value.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }))

      const orderData = {
        customer: customerData,
        items: orderItems,
        total_amount: total.value
      }

      const response = await axios.post('https://ifoda-shop.uz/api/orders/', orderData)
      
      // Buyurtma muvaffaqiyatli bo'lsa savatni tozalash
      clearCart()
      return response.data
      
    } catch (err) {
      error.value = err.response?.data?.message || 'Buyurtma yuborishda xatolik yuz berdi'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    items,
    total,
    isLoading,
    error,
    addToCart,
    removeFromCart,
    increment,
    decrement,
    clearCart,
    submitOrder
  }
})