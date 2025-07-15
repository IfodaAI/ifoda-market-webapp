<template>
  <FullscreenLoader v-if="showLoader" />
  <Container v-else :theme="theme">
    <RouterView />
    <BottomBar />
  </Container>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Container from '@/components/Container.vue'
import BottomBar from '@/components/BottomBar.vue'
import FullscreenLoader from './components/FullscreenLoader.vue'

const route = useRoute() // ❗ BU JOY MUHIM
const theme = ref('light')
const showLoader = ref(true)

onMounted(() => {
  // 2 soniyalik splash loader
  setTimeout(() => {
    showLoader.value = false
  }, 2000)
})

// Telegram WebApp bilan sinxronlashtirish
onMounted(() => {
  if (typeof window.Telegram === 'undefined') {
    window.Telegram = {
      WebApp: {
        ready: () => { },
        expand: () => { },
        colorScheme: 'light',
        onEvent: () => { },
        BackButton: {
          show: () => { },
          hide: () => { },
          onEvent: () => { },
          offEvent: () => { }
        }
      },
    }
  }

  const tg = window.Telegram.WebApp
  tg.ready()
  tg.expand()

  // Theme'ni aniqlab olamiz
  theme.value = tg.colorScheme || 'light'
  document.body.classList.toggle('dark-mode', theme.value === 'dark')

  // Telegramda theme o‘zgarsa
  tg.onEvent('themeChanged', () => {
    theme.value = tg.colorScheme
    document.body.classList.toggle('dark-mode', theme.value === 'dark')
  })

  // Boshlanishida backButton holatini aniqlaymiz
  handleBackButton(route.path)
})

// Path o'zgarganda back button'ni sozlaymiz
watch(route, (newRoute) => {
  handleBackButton(newRoute.path)
})

function handleBackButton(path) {
  const tg = window.Telegram.WebApp

  if (path === '/chat') {
    tg.BackButton.show()
    tg.onEvent('backButtonClicked', () => {
      window.history.back()
    })
  } else {
    tg.BackButton.hide()
    tg.offEvent('backButtonClicked')
  }
}

// Theme kuzatuvchisi: body class doim yangilanadi
watch(theme, (val) => {
  document.body.classList.toggle('dark-mode', val === 'dark')
})
</script>
