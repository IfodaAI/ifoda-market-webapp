import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './style.css'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')

const tg = window.Telegram.WebApp

// const setThemeVars = () => {
//   document.documentElement.style.setProperty('--tg-bg-color', theme.bg_color || '#ffffff')
//   document.documentElement.style.setProperty('--tg-text-color', theme.text_color || '#000000')
//   document.documentElement.style.setProperty('--tg-hint-color', theme.hint_color || '#777777')
//   document.documentElement.style.setProperty('--tg-link-color', theme.link_color || '#40ac3c')
//   document.documentElement.style.setProperty('--tg-button-color', theme.button_color || '#40ac3c')
//   document.documentElement.style.setProperty('--tg-button-text-color', theme.button_text_color || '#ffffff')
//   document.documentElement.style.setProperty('--tg-secondary-bg-color', theme.secondary_bg_color || '#f7f7f7')
// }

// setThemeVars()
