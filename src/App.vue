<template>
  <FullscreenLoader v-if="showLoader" />
  <Container v-else :theme="theme">
    <RouterView />
    <BottomBar v-if="!$route.path.includes('chat')" />
  </Container>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import Container from '@/components/Container.vue'
import BottomBar from '@/components/BottomBar.vue'
import FullscreenLoader from './components/FullscreenLoader.vue'

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
      },
    }
  }

  const tg = window.Telegram.WebApp
  tg.ready()
  tg.expand()
  tg.requestFullscreen?.()

  // Theme'ni aniqlab olamiz
  theme.value = tg.colorScheme || 'light'
  document.body.classList.toggle('dark-mode', theme.value === 'dark')

  // Event listener: Theme o‘zgarganda body'ga class qo‘shamiz
  tg.onEvent('themeChanged', () => {
    theme.value = tg.colorScheme
    document.body.classList.toggle('dark-mode', theme.value === 'dark')
  })

  console.log(`Telegram WebApp initialized with theme: ${theme.value}`)
})

// Har ehtimolga qarshi theme o‘zgarsa, body class yangilansin
watch(theme, (val) => {
  document.body.classList.toggle('dark-mode', val === 'dark')
})
</script>
