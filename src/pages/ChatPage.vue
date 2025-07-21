<template>
    <div class="chat-page">
        <div class="chat-header">
            <button class="back-btn" @click="goBack">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
            </button>
            <p>💬 Plant Doctor</p>
        </div>

        <div class="chat-box" ref="chatBox">
            <div v-if="loading" class="loading-messages">
                <div class="loading-spinner"></div>
            </div>

            <div v-for="msg in messages" :key="msg.id" class="chat-message" :class="msg.from">
                <div class="message-content">
                    <img v-if="msg.image" :src="msg.image" class="chat-image" @load="scrollToBottom" />
                    <p v-if="msg.text">{{ msg.text }}</p>
                </div>
                <div class="message-time">{{ formatTime(msg.timestamp || msg.id) }}</div>
            </div>
        </div>

        <div class="chat-input" :class="{ 'input-active': inputFocused }">
            <input type="file" @change="handleImageUpload" accept="image/*" hidden ref="fileInput" />
            <button class="upload-btn" @click="$refs.fileInput.click()">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
            </button>

            <input v-model="newMessage" type="text" placeholder="Xabar yozing..." @focus="activateInput"
                @blur="inputFocused = false" @keyup.enter="sendMessage" :disabled="!socketConnected" />

            <button @click="sendMessage" :disabled="!newMessage.trim() || !socketConnected">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
            </button>
        </div>

        <div v-if="!socketConnected" class="connection-status">
            <div class="connection-dot"></div>
            <span>Ulanmoqda...</span>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const messages = ref([])
const newMessage = ref('')
const socket = ref(null)
const socketConnected = ref(false)
const loading = ref(true)

// WebSocket connection
const connectWebSocket = () => {
    const chatId = route.params.id
    if (!chatId) return

    socket.value = new WebSocket(`wss://ifoda-shop.uz/ws/chat/${chatId}/`)

    socket.value.onopen = () => {
        console.log('WebSocket connected')
        socketConnected.value = true
        loadMessages()
    }

    socket.value.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data)
            console.log('Message received:', data)

            if (data.type === 'TEXT') {
                messages.value.push({
                    id: Date.now(),
                    text: data.message,
                    from: data.sender === 'BOT' ? 'bot' : 'user',
                    timestamp: new Date().toISOString(),
                    type: 'TEXT'
                })
                scrollToBottom()
            }
        } catch (error) {
            console.error('Error parsing message:', error)
        }
    }

    socket.value.onclose = () => {
        console.log('WebSocket disconnected')
        socketConnected.value = false
        setTimeout(connectWebSocket, 5000) // Reconnect after 5 seconds
    }

    socket.value.onerror = (error) => {
        console.error('WebSocket error:', error)
        socketConnected.value = false
    }
}

const sendMessage = () => {
    if (!newMessage.value.trim() || !socketConnected.value) return

    const messageData = {
        message: newMessage.value,
        sender: 'USER', // Or get from Telegram user data
        type: 'TEXT'
    }

    // Add to local messages immediately
    messages.value.push({
        id: Date.now(),
        text: newMessage.value,
        from: 'me',
        timestamp: new Date().toISOString(),
        type: 'TEXT'
    })

    newMessage.value = ''
    scrollToBottom()

    // Send via WebSocket
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
        socket.value.send(JSON.stringify(messageData))
    } else {
        console.error('WebSocket not connected')
        // Fallback to HTTP API if needed
    }
}

// Other methods remain the same (loadMessages, handleImageUpload, etc.)

onMounted(() => {
    connectWebSocket()
})

onBeforeUnmount(() => {
    if (socket.value) {
        socket.value.close()
    }
})
</script>

<style scoped>
/* Existing styles... */

.loading-messages {
    display: flex;
    justify-content: center;
    padding: 20px;
}

.loading-spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(64, 172, 60, 0.2);
    border-radius: 50%;
    border-top-color: var(--primary);
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.connection-status {
    position: fixed;
    bottom: 70px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--card-bg);
    padding: 6px 12px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.connection-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #ffc107;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% {
        opacity: 0.5;
    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0.5;
    }
}

.chat-input:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
}
</style>