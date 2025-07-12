<template>
  <FullscreenLoader v-if="showLoader" />
  <Container v-else :theme="theme">
    <RouterView />
    <BottomBar v-if="!$route.path.includes('chat')" />
  </Container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Container from '@/components/Container.vue'
import BottomBar from '@/components/BottomBar.vue'
import FullscreenLoader from './components/FullscreenLoader.vue'

const theme = ref('light')
const showLoader = ref(true)


onMounted(() => {
  setTimeout(() => {
    showLoader.value = false
  }, 2000) // 2 soniya kutadi
})

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
  theme.value = tg.colorScheme || 'light'
  tg.onEvent('themeChanged', () => {
    theme.value = tg.colorScheme
  })
})
</script>
