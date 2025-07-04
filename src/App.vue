<template>
  <Container :theme="theme">
    <RouterView />
    <BottomBar />
  </Container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Container from '@/components/Container.vue'
import BottomBar from '@/components/BottomBar.vue'

const theme = ref('light')

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
