<template>
  <FullscreenLoader v-if="showLoader" />
  <Container v-else :theme="theme">
    <RouterView />
    <BottomBar v-if="!$route.path.includes('chat') && !$route.path.includes('register')" />
  </Container>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Container from '@/components/Container.vue'
import BottomBar from '@/components/BottomBar.vue'
import FullscreenLoader from './components/FullscreenLoader.vue'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const theme = ref('light')
const showLoader = ref(true)


const localUser = localStorage.getItem('telegram_user_id')

onMounted(async () => {



  if (typeof window.Telegram === 'undefined') {
    window.Telegram = {
      WebApp: {
        ready: () => { },
        expand: () => { },
        colorScheme: 'light',
        initDataUnsafe: {
          user: {
            id: 'demo_user',
            first_name: 'Demo',
            last_name: 'User',
            username: 'demo'
          }
        },
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
  await checkUserRegistration(localUser, tg.initDataUnsafe.user.id)
  tg.ready()
  tg.expand()

  // Theme'ni aniqlab olamiz
  theme.value = tg.colorScheme || 'light'
  document.body.classList.toggle('dark-mode', theme.value === 'dark')

  // Telegramda theme o'zgarsa
  tg.onEvent('themeChanged', () => {
    theme.value = tg.colorScheme
    document.body.classList.toggle('dark-mode', theme.value === 'dark')
  })




  // 2 soniyalik splash loader
  setTimeout(() => {
    showLoader.value = false
  }, 2000)

  // Boshlanishida backButton holatini aniqlaymiz
  handleBackButton(route.path)
})

// Foydalanuvchi registratsiyadan o'tganligini tekshirish
const checkUserRegistration = async (telegramId, tgId) => {
  if (!telegramId) {
    router.push('/register')
    return
  }
  try {
    const response = await axios.get(`https://ifoda-shop.uz/telegramuser_api/get-telegram-id/${tgId}/`)

    if (response.data.error && response.data.error.includes('does not exist')) {
      router.push('/register')
    }
  } catch (error) {
    console.error('Foydalanuvchi tekshirishda xato:', error)

    router.push('/register')
  }
}

// Path o'zgarganda back button'ni sozlaymiz
watch(route, (newRoute) => {
  handleBackButton(newRoute.path)
})

function handleBackButton(path) {
  const tg = window.Telegram.WebApp

  if (path === '/chats') {
    tg.BackButton.show()
    tg.onEvent('backButtonClicked', () => {
      router.push('/')
    })
  } else if (path === 'chat/id') {
    tg.BackButton.show()
    tg.onEvent('backButtonClicked', () => {
      router.push('/chats')
    })
  }
  else {
    tg.BackButton.hide()
    tg.offEvent('backButtonClicked')
  }
}

// Theme kuzatuvchisi: body class doim yangilanadi
watch(theme, (val) => {
  document.body.classList.toggle('dark-mode', val === 'dark')
})
</script>