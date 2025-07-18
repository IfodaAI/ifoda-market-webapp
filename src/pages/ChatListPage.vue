<template>
    <div class="chat-list-page">
        <div class="header">
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
                user_id: userID,
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

<style scoped>
.chat-list-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--bg-color);
    color: var(--text-color);
    position: relative;
}

.header {
    display: flex;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    background: var(--card-bg);
    z-index: 10;
}

.header h1 {
    margin: 0 auto;
    font-size: 20px;
}

.chat-list {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
}

.chat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    margin-bottom: 12px;
    background: var(--card-bg);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.chat-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chat-info h3 {
    margin: 0 0 4px 0;
    font-size: 16px;
    color: var(--primary);
}

.chat-date {
    margin: 0;
    font-size: 14px;
    opacity: 0.7;
}

.chat-arrow {
    opacity: 0.5;
    transition: transform 0.2s ease;
}

.chat-item:hover .chat-arrow {
    transform: translateX(3px);
    opacity: 1;
}

.new-chat-btn {
    position: sticky;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--primary);
    color: white;
    border: none;
    padding: 14px 24px;
    border-radius: 24px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin: 16px auto;
    width: calc(100% - 32px);
    max-width: 500px;
    transition: all 0.2s ease;
}

.new-chat-btn:active {
    transform: translateX(-50%) scale(0.98);
}

.empty-chats {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;
    text-align: center;
}

.empty-chats p {
    font-size: 16px;
    opacity: 0.8;
}

.loading {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.chat-skeleton {
    height: 80px;
    border-radius: 12px;
    background: linear-gradient(90deg, var(--skeleton-base), var(--skeleton-highlight), var(--skeleton-base));
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }

    100% {
        background-position: 200% 0;
    }
}
</style>