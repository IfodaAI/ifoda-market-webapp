// src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.example.com', // ← bu yerga o‘zingning API bazangni yoz
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
