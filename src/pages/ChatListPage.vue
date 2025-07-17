<template>
    <div class="chat-list-page">
        <div class="header">
            <button class="back-btn" @click="goBack">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
            </button>
            <h1>💬 Plant Doctor</h1>
        </div>

        <div class="chat-list">
            <div v-if="loading" class="loading">
                <div v-for="i in 3" :key="i" class="chat-skeleton"></div>
            </div>

            <div v-else-if="chats.length === 0" class="empty-chats">
                <!-- <img src="@/assets/empty-chats.png" alt="No chats" /> -->
                <p>Sizda hali chatlar mavjud emas</p>
            </div>

            <div v-else>
                <div v-for="chat in chats" :key="chat.id" class="chat-item" @click="openChat(chat.id)">
                    <div class="chat-info">
                        <h3>Chat #{{ chat.id.slice(0, 6) }}</h3>
                        <p class="last-message">{{ chat.lastMessage || 'No messages yet' }}</p>
                    </div>
                    <div class="chat-time">{{ formatTime(chat.updatedAt) }}</div>
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

const goBack = () => {
    router.back()
}

const fetchChats = async () => {
    loading.value = true
    try {
        // Bu yerda oldingi chatlarni yuklash uchun API so'rovi bo'lishi kerak
        // Hozircha demo ma'lumotlar
        chats.value = [
            {
                id: 'chat_123456',
                lastMessage: 'Sizning o`simligingiz...',
                updatedAt: '2025-07-15T14:30:00Z'
            },
            {
                id: 'chat_789012',
                lastMessage: 'Dori tavsiya etamiz...',
                updatedAt: '2025-07-10T09:15:00Z'
            }
        ]
    } catch (error) {
        console.error('Chatlarni yuklashda xato:', error)
    } finally {
        loading.value = false
    }
}

const startNewChat = async () => {
    try {
        const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user
        const response = await axios.post('https://ifoda-shop.uz/order_api/', {
            user_id: tgUser?.id || 'anonymous',
            user_full_name: `${tgUser?.first_name || ''} ${tgUser?.last_name || ''}`.trim() || 'Foydalanuvchi',
            user_name: tgUser?.username || ''
        })

        // Yangi chat ochish
        router.push(`/chat/${response.data.chat_id}`)
    } catch (error) {
        console.error('Yangi chat boshlashda xato:', error)
    }
}

const openChat = (chatId) => {
    router.push(`/chat/${chatId}`)
}

const formatTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('uz-UZ', {
        day: 'numeric',
        month: 'short',
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
    padding: 16px;
    margin-bottom: 12px;
    background: var(--card-bg);
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.2s;
}

.chat-item:hover {
    transform: translateY(-2px);
}

.chat-info h3 {
    margin: 0 0 4px 0;
    font-size: 16px;
}

.last-message {
    margin: 0;
    font-size: 14px;
    opacity: 0.8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
}

.chat-time {
    font-size: 12px;
    opacity: 0.6;
    white-space: nowrap;
}

.new-chat-btn {
    position: sticky;
    bottom: 20px;
    background: var(--primary);
    color: white;
    border: none;
    padding: 14px 24px;
    border-radius: 24px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin: 0 auto;
    width: 90%;
}

.new-chat-btn:active {
    background: linear-gradient(135deg, #b8efb7, #92dc91);
    color: #2e7d32;
    cursor: not-allowed;
    box-shadow: none;
}

.empty-chats {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;
    text-align: center;
}

.empty-chats img {
    width: 150px;
    height: 150px;
    opacity: 0.7;
    margin-bottom: 16px;
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