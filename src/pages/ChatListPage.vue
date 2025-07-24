<template>
    <div class="chat-list-page">
        <div class="header-chat-list">
            <h1>💬 Plant Doctor</h1>
        </div>

        <div class="chat-list">
            <div v-if="loading" class="loading">
                <div v-for="i in 3" :key="i" class="chat-skeleton"></div>
            </div>

            <div v-else-if="chats.length === 0" class="empty-chats">
                <p>Sizda hali chatlar mavjud emas</p>
            </div>

            <div v-else>
                <div v-for="(chat, index) in chats" :key="chat.id" class="chat-item" @click="openChat(chat.id)">
                    <div class="chat-info">
                        <h3>Chat #{{ index + 1 }}</h3>
                        <p class="chat-date">{{ formatDate(chat.order_date) }}</p>
                    </div>
                    <div class="chat-arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <button class="new-chat-btn" @click="startNewChat">
            + Yangi chat boshlash
        </button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import '../styles/chat-list.css'

const router = useRouter()
const chats = ref([])
const loading = ref(false)
const tg = window.Telegram?.WebApp

const fetchChats = async () => {
    loading.value = true
    try {
        const userID = tg?.initDataUnsafe?.user?.id;
        const response = await axios.get('https://ifoda-shop.uz/order_api/my_orders/', {
            params: {
                user_id: userID || 5319120806,
                is_chat: true
            }
        })

        // Filter only chat orders and sort by date (newest first)
        chats.value = response.data
    } catch (error) {
        console.error('Chatlarni yuklashda xato:', error)
    } finally {
        loading.value = false
    }
}

const startNewChat = async () => {
    const userID = localStorage.getItem('telegram_user_id')
    try {
        const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user
        const response = await axios.post('https://ifoda-shop.uz/order_api/', {
            user: userID,
            user_full_name: `${tgUser?.first_name || ''} ${tgUser?.last_name || ''}`.trim() || 'Foydalanuvchi',
            user_name: tgUser?.username || '',
            is_chat: true
        })

        // Yangi chat ochish
        router.push(`/chat/${response.data.id}`)
    } catch (error) {
        console.error('Yangi chat boshlashda xato:', error)
    }
}

const openChat = (chatId) => {
    router.push(`/chat/${chatId}`)
}

const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('uz-UZ', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

onMounted(fetchChats)
</script>
