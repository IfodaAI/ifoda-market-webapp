// src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://ifoda-shop.uz', // ← bu yerga o‘zingning API bazangni yoz
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 soniya kutish
})

export default api
