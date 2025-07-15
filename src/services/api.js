// src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://94.141.76.204:8088/pills_api/', // ← bu yerga o‘zingning API bazangni yoz
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 soniya kutish
})

export default api
